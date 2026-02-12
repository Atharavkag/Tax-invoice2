import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Company } from '@/data/mockData';
import { Plus, Building2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AddCompanyDialogProps {
  onAddCompany: (company: Company) => void;
}

const indianStates = [
  { code: '01', name: 'Jammu & Kashmir' },
  { code: '02', name: 'Himachal Pradesh' },
  { code: '03', name: 'Punjab' },
  { code: '04', name: 'Chandigarh' },
  { code: '05', name: 'Uttarakhand' },
  { code: '06', name: 'Haryana' },
  { code: '07', name: 'Delhi' },
  { code: '08', name: 'Rajasthan' },
  { code: '09', name: 'Uttar Pradesh' },
  { code: '10', name: 'Bihar' },
  { code: '11', name: 'Sikkim' },
  { code: '12', name: 'Arunachal Pradesh' },
  { code: '13', name: 'Nagaland' },
  { code: '14', name: 'Manipur' },
  { code: '15', name: 'Mizoram' },
  { code: '16', name: 'Tripura' },
  { code: '17', name: 'Meghalaya' },
  { code: '18', name: 'Assam' },
  { code: '19', name: 'West Bengal' },
  { code: '20', name: 'Jharkhand' },
  { code: '21', name: 'Odisha' },
  { code: '22', name: 'Chhattisgarh' },
  { code: '23', name: 'Madhya Pradesh' },
  { code: '24', name: 'Gujarat' },
  { code: '27', name: 'Maharashtra' },
  { code: '29', name: 'Karnataka' },
  { code: '30', name: 'Goa' },
  { code: '32', name: 'Kerala' },
  { code: '33', name: 'Tamil Nadu' },
  { code: '36', name: 'Telangana' },
  { code: '37', name: 'Andhra Pradesh' },
];

const AddCompanyDialog = ({ onAddCompany }: AddCompanyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gstNo: '',
    address: '',
    stateCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateGstFormat = (gst: string): boolean => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    if (!formData.gstNo.trim()) {
      newErrors.gstNo = 'GST number is required';
    } else if (!validateGstFormat(formData.gstNo)) {
      newErrors.gstNo = 'Invalid GST format';
    }
    if (!formData.stateCode) newErrors.stateCode = 'State is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedState = indianStates.find(s => s.code === formData.stateCode);
    
    const newCompany: Company = {
      id: `new-${Date.now()}`,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      gstNo: formData.gstNo.toUpperCase().trim(),
      address: formData.address.trim(),
      state: selectedState?.name || '',
      stateCode: formData.stateCode,
      pendingAmount: 2000,
    };

    onAddCompany(newCompany);
    setFormData({ name: '', phone: '', gstNo: '', address: '', stateCode: '' });
    setErrors({});
    setOpen(false);
    
    toast({
      title: 'Company added',
      description: `${newCompany.name} has been added and selected`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Add New Company
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Company Name *</Label>
            <Input
              id="name"
              placeholder="Enter company name"
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setErrors(prev => ({ ...prev, name: '' }));
              }}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Contact Number *</Label>
            <Input
              id="phone"
              placeholder="e.g., +91 98765 43210"
              value={formData.phone}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, phone: e.target.value }));
                setErrors(prev => ({ ...prev, phone: '' }));
              }}
            />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gstNo">GST Number *</Label>
            <Input
              id="gstNo"
              placeholder="e.g., 27AABCU9603R1ZM"
              value={formData.gstNo}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, gstNo: e.target.value.toUpperCase() }));
                setErrors(prev => ({ ...prev, gstNo: '' }));
              }}
              className="font-mono uppercase"
              maxLength={15}
            />
            {errors.gstNo && <p className="text-xs text-destructive">{errors.gstNo}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={formData.stateCode}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, stateCode: value }));
                setErrors(prev => ({ ...prev, stateCode: '' }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {indianStates.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name} ({state.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.stateCode && <p className="text-xs text-destructive">{errors.stateCode}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address (optional)</Label>
            <Input
              id="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, address: e.target.value }));
                setErrors(prev => ({ ...prev, address: '' }));
              }}
            />
            {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="h-4 w-4 mr-1" />
              Add Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyDialog;
