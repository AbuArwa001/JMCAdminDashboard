export interface BankAccount {
    id: string;
    bank_name: string;
    paybill_number?: string;
    account_number: string;
    account_name: string;
    is_active: boolean;
    consumer_key?: string;
    consumer_secret?: string;
    passkey?: string;
    initiator_name?: string;
    security_credential?: string;
    created_at: string;
    updated_at: string;
}

export interface Transfer {
    id: string;
    source_paybill: string;
    destination_account: string;
    destination_account_details?: BankAccount;
    amount: number;
    initiated_by: string;
    initiated_by_name: string;
    status: 'Pending' | 'Completed' | 'Failed';
    transaction_reference?: string;
    description?: string;
    created_at: string;
    completed_at?: string;
}
