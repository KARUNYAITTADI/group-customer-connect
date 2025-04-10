
import { Customer, CustomerGroup } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface CustomerDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  customerGroup: CustomerGroup | null;
}

export function CustomerDetails({
  open,
  onOpenChange,
  customer,
  customerGroup,
}: CustomerDetailsProps) {
  if (!customer) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "-";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>View Customer</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-amber-500">Basic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">First Name</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.firstName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Last Name</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.lastName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Email Address</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.emailAddress}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Phone Number</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.phoneNumber}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Customer Group</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">
                  {customerGroup ? (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customerGroup.customerGroupName === "VIP" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {customerGroup.customerGroupName}
                    </span>
                  ) : "-"}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.gender}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date of Birth</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{formatDate(customer.dateOfBirth)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Anniversary</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{formatDate(customer.anniversaryDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-bold text-amber-500">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Company Name</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.companyName || "-"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Company Address</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.companyAddress || "-"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Personal Address</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.address || "-"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Amount Due</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.amountDue ? formatCurrency(customer.amountDue) : "-"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">GSTIN</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.gstNumber || "-"}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Tax State Code</h4>
                <p className="text-md bg-muted p-2 rounded mt-1">{customer.taxStateCode || "-"}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
