export type ServiceLevelCode = "ECO" | "ONX" | "SDX";

export interface ShiplogicAddress {
  type?: "business" | "residential" | "counter" | "locker" | "unknown";
  company?: string;
  street_address: string;
  local_area: string;
  city: string;
  zone: string; // Province e.g. Gauteng, Western Cape
  country: string; // ISO 2-letter e.g. ZA
  code: string; // Postal code e.g. 1559
  lat?: number;
  lng?: number;
}

export interface ShiplogicContact {
  name: string;
  mobile_number?: string;
  email?: string;
}

/** Shiplogic parcel schema. `submitted_*` fields are set only at creation. */
export interface ShiplogicParcel {
  submitted_length_cm: number;
  submitted_width_cm: number;
  submitted_height_cm: number;
  submitted_weight_kg: number;
  parcel_description?: string;
}

export interface ShiplogicShipmentPayload {
  service_level_code: string;
  customer_reference: string;
  customer_reference_name?: string;
  collection_address: ShiplogicAddress;
  collection_contact: ShiplogicContact;
  delivery_address: ShiplogicAddress;
  delivery_contact: ShiplogicContact;
  parcels: ShiplogicParcel[];
  declared_value?: number;
  mute_notifications?: boolean;
  special_instructions_collection?: string;
  special_instructions_delivery?: string;
}

export interface ShiplogicShipmentResponse {
  id?: number | string;
  tracking_reference?: string;
  short_tracking_reference?: string;
  custom_tracking_reference?: string;
  waybill_number?: string;
  tracking_url?: string;
  status?: string;
  rate?: number;
  service_level_code?: string;
  service_level?: {
    code: string;
    name: string;
  };
  labels?: Array<{
    url: string;
    size: string;
  }>;
  message?: string;
  errors?: unknown;
}

export interface CourierGuyConfig {
  apiKey: string;
  /** Root host without trailing slash or version suffix, e.g. https://api.shiplogic.com */
  baseUrl: string;
  isSandbox: boolean;
  /** Default service level used only when the order's method can't be parsed. */
  serviceLevelCode: string;
  hub: {
    company: string;
    streetAddress: string;
    localArea: string;
    city: string;
    zone: string;
    postalCode: string;
    country: string;
    contactName: string;
    phone: string;
    email: string;
  };
}

export interface CreateShipmentResult {
  success: boolean;
  waybillNumber?: string;
  shiplogicShipmentId?: string;
  trackingUrl?: string;
  labelUrl?: string;
  serviceLevel?: string;
  error?: string;
  rawResponse?: unknown;
}
