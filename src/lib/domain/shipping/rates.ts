import { getCourierGuyConfig, getShiplogicAuthHeader } from "./courierguy";
import {
  computeParcelWeightKg,
  normalizeDestinationParams,
  NormalizedDestination,
  signShippingQuote,
} from "./quote";

export interface ShippingRateOption {
  code: string;
  name: string;
  description: string;
  rate: number;
  currency: string;
  estimatedDelivery: string;
  isCheapest?: boolean;
  quoteToken?: string;
}

export interface GetRatesParams {
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  itemCount?: number;
  weightInKg?: number;
}

function attachQuoteTokens(
  options: ShippingRateOption[],
  destination: NormalizedDestination,
  weightInKg: number
): ShippingRateOption[] {
  return options.map((option) => ({
    ...option,
    quoteToken: signShippingQuote({
      code: option.code,
      name: option.name,
      rate: option.rate,
      currency: option.currency,
      destination,
      weightInKg,
    }),
  }));
}

/**
 * Generates reliable regional fallback rates from Wright Crossing Shopping Centre (Springs, Gauteng)
 * when Shiplogic is unreachable, unauthenticated, or in sandbox testing mode.
 */
function getFallbackRates(province?: string): ShippingRateOption[] {
  const isGauteng = (province || "Gauteng").toLowerCase().includes("gauteng");

  const options: ShippingRateOption[] = [
    {
      code: "ECO",
      name: "Economy Delivery",
      description: "The Courier Guy Road Freight (2–4 Business Days)",
      rate: 142.0,
      currency: "ZAR",
      estimatedDelivery: "2–4 Business Days",
      isCheapest: true,
    },
    {
      code: "ONX",
      name: "Premium Overnight Express",
      description: "Priority Air Freight Dispatch (Next Business Day)",
      rate: isGauteng ? 210.0 : 245.0,
      currency: "ZAR",
      estimatedDelivery: "1–2 Business Days",
      isCheapest: false,
    },
  ];

  if (isGauteng) {
    options.push({
      code: "SDX",
      name: "Same Day Local Express",
      description: "Direct Local Courier from Wright Crossing Hub (Gauteng Only)",
      rate: 295.0,
      currency: "ZAR",
      estimatedDelivery: "Same Day (Orders before 11:00)",
      isCheapest: false,
    });
  }

  return options;
}

/**
 * Queries live shipping rates from The Courier Guy Shiplogic API (/v2/rates or /rates).
 * Passes customer delivery suburb/postal code and a parcel weight of 1kg.
 * Automatically falls back to localized South African rates if API is unconfigured or in sandbox.
 */
export async function fetchShiplogicRates(
  params: GetRatesParams
): Promise<ShippingRateOption[]> {
  const config = getCourierGuyConfig();
  const weight =
    typeof params.weightInKg === "number" &&
    Number.isFinite(params.weightInKg) &&
    params.weightInKg > 0
      ? Math.round(params.weightInKg * 10) / 10
      : computeParcelWeightKg(params.itemCount ?? 2);

  const destination = normalizeDestinationParams(params);
  const { province, city, suburb, postalCode } = destination;

  console.log(`[🚚 COURIER RATES] Requesting rates for destination: ${suburb}, ${city}, ${province} (${postalCode}) | Weight: ${weight}kg`);

  // If no API key is set, immediately return signed fallback rates
  if (!config?.apiKey) {
    console.log("[🚚 COURIER RATES] No Shiplogic API key configured in .env.local; returning standard South African courier rates.");
    return attachQuoteTokens(getFallbackRates(province), destination, weight);
  }

  const payload = {
    collection_address: {
      type: "business",
      company: config.hub.company,
      street_address: config.hub.streetAddress,
      local_area: config.hub.localArea,
      city: config.hub.city,
      zone: config.hub.zone,
      country: "ZA",
      code: config.hub.postalCode,
    },
    delivery_address: {
      type: "residential",
      street_address: `${suburb}, ${city}`,
      local_area: suburb,
      city: city,
      zone: province,
      country: "ZA",
      code: postalCode,
    },
    parcels: [
      {
        parcel_description: "Divinity Cosmetics 1kg Parcel",
        submitted_length_cm: 15,
        submitted_width_cm: 10,
        submitted_height_cm: 10,
        submitted_weight_kg: weight,
      },
    ],
  };

  try {
    const endpoint = `${config.baseUrl}/v3/rates`;
    let liveRates: any[] | null = null;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: getShiplogicAuthHeader(config.apiKey),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json().catch(() => null);
      if (data?.rates && Array.isArray(data.rates) && data.rates.length > 0) {
        liveRates = data.rates;
      }
    } else {
      const errBody = await response.json().catch(() => null);
      console.warn(
        `[🚚 COURIER RATES] ${config.isSandbox ? "SANDBOX" : "LIVE"} ${endpoint} returned HTTP ${response.status}:`,
        errBody
      );
    }

    if (liveRates && liveRates.length > 0) {
      const parsedOptions: ShippingRateOption[] = liveRates
        .map((item) => {
          const rateAmount = Number(item.total ?? item.rate ?? 0);
          if (!Number.isFinite(rateAmount) || rateAmount <= 0) {
            return null;
          }
          const code = String(item.service_level?.code || "ECO").trim().toUpperCase();
          const name = String(item.service_level?.name || "Standard Courier").trim();
          const description = String(
            item.service_level?.description || "Door-to-door courier delivery"
          ).trim();
          const transit = item.transit_time
            ? `${item.transit_time.min}–${item.transit_time.max} ${item.transit_time.unit?.replace("_", " ")}`
            : "2–4 Business Days";

          return {
            code,
            name,
            description,
            rate: Math.round(rateAmount * 100) / 100,
            currency: String(item.currency || "ZAR").trim().toUpperCase(),
            estimatedDelivery: transit,
          };
        })
        .filter((opt): opt is ShippingRateOption => opt !== null);

      if (parsedOptions.length > 0) {
        // Sort from cheapest to most expensive
        parsedOptions.sort((a, b) => a.rate - b.rate);
        parsedOptions[0].isCheapest = true;

        console.log(
          `[🚚 COURIER RATES] Retrieved ${parsedOptions.length} live rates from Shiplogic:`
        );
        parsedOptions.forEach((opt) =>
          console.log(`   └─ ${opt.name} (${opt.code}): R${opt.rate.toFixed(2)} [${opt.estimatedDelivery}]`)
        );
        return attachQuoteTokens(parsedOptions, destination, weight);
      }
    }
  } catch (error) {
    console.warn("[🚚 COURIER RATES] Live Shiplogic rates query encountered an error:", error);
  }

  const fallback = getFallbackRates(province);
  console.log(`[🚚 COURIER RATES] Serving ${fallback.length} regional fallback options:`);
  fallback.forEach((opt) =>
    console.log(`   └─ ${opt.name} (${opt.code}): R${opt.rate.toFixed(2)} [${opt.estimatedDelivery}]`)
  );
  return attachQuoteTokens(fallback, destination, weight);
}

