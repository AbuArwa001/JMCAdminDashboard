interface Props {
  formData: any;
  paymentMethod: "MPESA" | "BANK";
  onSetPaymentMethod: (m: "MPESA" | "BANK") => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DriveEditPayment({ formData, paymentMethod, onSetPaymentMethod, onChange }: Props) {
  return (
    <div className="border-t border-gray-100 pt-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Configuration</h3>
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="paymentMethod" checked={paymentMethod === "MPESA"} onChange={() => onSetPaymentMethod("MPESA")} className="text-primary focus:ring-primary" />
          <span className="font-medium text-gray-700">M-Pesa Paybill</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="radio" name="paymentMethod" checked={paymentMethod === "BANK"} onChange={() => onSetPaymentMethod("BANK")} className="text-primary focus:ring-primary" />
          <span className="font-medium text-gray-700">Bank Account</span>
        </label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
        {paymentMethod === "MPESA" ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paybill Number</label>
              <input type="text" name="paybill_number" value={formData.paybill_number} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. 247247" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
              <input type="text" name="account_name" value={formData.account_name} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. JMC Donation" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Paybill / Code</label>
              <input type="text" name="paybill_number" value={formData.paybill_number} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Bank Code" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input type="text" name="account_number" value={formData.account_number} onChange={onChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Account Number" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

