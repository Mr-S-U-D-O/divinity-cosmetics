import { getCourierGuyConfig, getShiplogicAuthHeader } from "./courierguy";

export interface ShippingRateOption {
  code: string;
  name: string;
  description: string;
  rate: number;
  currency: string;
  estimatedDelivery: string;
  isCheapest?: boolean;
}

export interface GetRatesParams {
  suburb?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  weightInKg?: number;
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
  const weight = typeof params.weightInKg === "number" && params.weightInKg > 0 ? params.weightInKg : 1.0;
  const province = params.province || "Gauteng";
  const city = params.city || (province.includes("Gauteng") ? "Johannesburg" : "Cape Town");
  const suburb = params.suburb || "Rosebank";
  const postalCode = params.postalCode || (province.includes("Gauteng") ? "2196" : "8001");

  console.log(`[🚚 COURIER RATES] Requesting rates for destination: ${suburb}, ${city}, ${province} (${postalCode}) | Weight: ${weight}kg`);

  // If no API key is set, immediately return fallback rates
  if (!config?.apiKey) {
    console.log("[🚚 COURIER RATES] No Shiplogic API key configured in .env.local; returning standard South African courier rates.");
    return getFallbackRates(province);
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
      const parsedOptions: ShippingRateOption[] = liveRates.map((item) => {
        const rateAmount = Number(item.total || item.rate || 0);
        const code = item.service_level?.code || "ECO";
        const name = item.service_level?.name || "Standard Courier";
        const description = item.service_level?.description || "Door-to-door courier delivery";
        const transit = item.transit_time
          ? `${item.transit_time.min}–${item.transit_time.max} ${item.transit_time.unit?.replace("_", " ")}`
          : "2–4 Business Days";

        return {
          code,
          name,
          description,
          rate: Math.round(rateAmount * 100) / 100,
          currency: item.currency || "ZAR",
          estimatedDelivery: transit,
        };
      });

      // Sort from cheapest to most expensive
      parsedOptions.sort((a, b) => a.rate - b.rate);
      if (parsedOptions.length > 0) {
        parsedOptions[0].isCheapest = true;
      }

      console.log(
        `[🚚 COURIER RATES] Retrieved ${parsedOptions.length} live rates from Shiplogic:`
      );
      parsedOptions.forEach((opt) =>
        console.log(`   └─ ${opt.name} (${opt.code}): R${opt.rate.toFixed(2)} [${opt.estimatedDelivery}]`)
      );
      return parsedOptions;
    }
  } catch (error) {
    console.warn("[🚚 COURIER RATES] Live Shiplogic rates query encountered an error:", error);
  }

  const fallback = getFallbackRates(province);
  console.log(`[🚚 COURIER RATES] Serving ${fallback.length} regional fallback options:`);
  fallback.forEach((opt) =>
    console.log(`   └─ ${opt.name} (${opt.code}): R${opt.rate.toFixed(2)} [${opt.estimatedDelivery}]`)
  );
  return fallback;
}

