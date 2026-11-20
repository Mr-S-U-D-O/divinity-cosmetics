export interface ZohoAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  organizationId: string;
  accountsUrl: string;
  apiBaseUrl: string;
}

export interface ZohoTokenResponse {
  access_token: string;
  api_domain?: string;
  token_type: string;
  expires_in: number;
  error?: string;
}

export interface ZohoContactPerson {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_primary_contact: boolean;
}

export interface ZohoAddress {
  address?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface ZohoCreateContactPayload {
  contact_name: string;
  company_name?: string;
  customer_sub_type: "individual" | "business";
  contact_type: "customer";
  currency_code: string;
  contact_persons: ZohoContactPerson[];
  billing_address?: ZohoAddress;
  shipping_address?: ZohoAddress;
  notes?: string;
}

export interface ZohoSalesOrderLineItem {
  item_id?: string;
  salesorder_item_id?: string;
  name: string;
  description?: string;
  rate: number;
  quantity: number;
}

export interface ZohoCreateSalesOrderPayload {
  customer_id: string;
  salesorder_number: string;
  reference_number?: string;
  date: string;
  shipment_date?: string;
  line_items: ZohoSalesOrderLineItem[];
  shipping_charge?: number;
  notes?: string;
  terms?: string;
  delivery_method?: string;
  shipping_address_id?: string;
}

export interface ZohoCreateInvoicePayload {
  customer_id: string;
  salesorder_id?: string;
  reference_number?: string;
  date: string;
  due_date?: string;
  status?: "draft" | "sent";
  line_items: ZohoSalesOrderLineItem[];
  shipping_charge?: number;
  notes?: string;
  terms?: string;
  is_inclusive_tax?: boolean;
}

export interface ZohoCreatePaymentPayload {
  customer_id: string;
  payment_mode: string;
  amount: number;
  date: string;
  reference_number?: string;
  description?: string;
  invoices: Array<{
    invoice_id: string;
    amount_applied: number;
  }>;
}

export interface ZohoSyncResult {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  error?: string;
  customerId?: string;
  salesOrderId?: string;
  invoiceId?: string;
  paymentId?: string;
}

