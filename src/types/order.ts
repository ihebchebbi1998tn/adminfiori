export interface UserDetails {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    zip_code: string;
    order_note: string;
  }
  
  export interface OrderItem {
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    total_price: number;
    image: string;
    size: string;
    color: string;
    personalization: string;
    pack: string;
    box: string;
  }
  
  export interface PriceDetails {
    subtotal: number;
    shipping_cost: number;
    has_newsletter_discount: boolean;
    newsletter_discount_amount: number;
    final_total: number;
  }
  
  export interface Payment {
    method: string;
    status: string;
    konnect_payment_url: string | null;
    completed_at: string | null;
  }
  
  export interface OrderStatus {
    status: string;
    shipped_at: string | null;
    delivered_at: string | null;
  }
  
  export interface Order {
    id: number;
    order_id: string;
    created_at: string;
    user_details: UserDetails;
    items: OrderItem[];
    price_details: PriceDetails;
    payment: Payment;
    order_status: OrderStatus;
    updated_at: string;
  }