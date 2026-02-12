import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { InvoiceItem, Company, sellerInfo, bankDetails } from '@/data/mockData';
import { InvoiceOptionsData } from './InvoiceOptions';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 40,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  companyName: {
    fontSize: 20,
    fontWeight: 700,
    color: '#1e3a5f',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 9,
    color: '#64748b',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#2563eb',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
  },
  billingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  billingBox: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  billingLabel: {
    fontSize: 8,
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  billingName: {
    fontSize: 11,
    fontWeight: 600,
    color: '#1e3a5f',
    marginBottom: 4,
  },
  billingAddress: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.4,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e3a5f',
    padding: 8,
    borderRadius: 4,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableCell: {
    fontSize: 9,
    color: '#334155',
  },
  // Columns adjusted to match Sunshine-style format:
  // Sl No. | Description of Goods | HSN/SAC | Quantity | Rate | per | Amount
  col1: { width: '7%' },   // Sl No.
  col2: { width: '38%' },  // Description
  col3: { width: '12%' },  // HSN/SAC
  col4: { width: '13%' },  // Quantity
  col5: { width: '10%' },  // Rate
  col6: { width: '10%' },  // per
  col7: { width: '10%' },  // Amount
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankBox: {
    width: '48%',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  bankTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: '#1e3a5f',
    marginBottom: 8,
  },
  bankText: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
  },
  summaryBox: {
    width: '45%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 9,
    color: '#1e3a5f',
    fontWeight: 600,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#2563eb',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1e3a5f',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 700,
    color: '#2563eb',
  },
  notesSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  notesTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: '#92400e',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: '#78350f',
    lineHeight: 1.4,
  },
  termsSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: '#1e3a5f',
    marginBottom: 6,
  },
  termsText: {
    fontSize: 8,
    color: '#64748b',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
    textAlign: 'center',
  },
  dueDateBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  dueDateText: {
    fontSize: 10,
    fontWeight: 600,
    color: '#dc2626',
    textAlign: 'right',
  },
  transportInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  transportText: {
    fontSize: 9,
    color: '#475569',
  },
});

interface InvoicePdfProps {
  invoiceNumber: string;
  invoiceDate: string;
  items: InvoiceItem[];
  company: Company;
  options: InvoiceOptionsData;
}

const InvoicePdf = ({ invoiceNumber, invoiceDate, items, company, options }: InvoicePdfProps) => {
  const isSameState = company.stateCode === sellerInfo.stateCode;
  
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => {
      const baseAmount = item.item.rate * item.quantity;
      const discountAmount = (baseAmount * item.discount) / 100;
      return sum + (baseAmount - discountAmount);
    }, 0);
  };

  const calculateTotalGst = () => {
    return items.reduce((sum, item) => {
      const taxableAmount = item.item.rate * item.quantity * (1 - item.discount / 100);
      return sum + (taxableAmount * item.item.gstRate) / 100;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const totalGst = calculateTotalGst();
  const grandTotal = subtotal + totalGst;
  const previousBalance = company.pendingAmount ?? 0;
  const totalPayable = previousBalance + grandTotal;

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{sellerInfo.name}</Text>
            <Text style={styles.companyDetails}>{sellerInfo.address}</Text>
            <Text style={styles.companyDetails}>{sellerInfo.city}, {sellerInfo.state} - {sellerInfo.pincode}</Text>
            <Text style={styles.companyDetails}>GSTIN: {sellerInfo.gstNo}</Text>
            <Text style={styles.companyDetails}>Phone: {sellerInfo.phone}</Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            <Text style={styles.invoiceNumber}>Invoice No: {invoiceNumber}</Text>
            <Text style={styles.invoiceNumber}>Date: {invoiceDate}</Text>
            {options.dueDate && (
              <View style={styles.dueDateBox}>
                <Text style={styles.dueDateText}>Due: {formatDueDate(options.dueDate)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Billing Section */}
        <View style={styles.billingSection}>
          <View style={styles.billingBox}>
            <Text style={styles.billingLabel}>Bill To</Text>
            <Text style={styles.billingName}>{company.name}</Text>
            <Text style={styles.billingAddress}>{company.address}</Text>
            <Text style={styles.billingAddress}>{company.state} ({company.stateCode})</Text>
            <Text style={styles.billingAddress}>GSTIN: {company.gstNo}</Text>
          </View>
          <View style={styles.billingBox}>
            <Text style={styles.billingLabel}>Ship To</Text>
            <Text style={styles.billingName}>{company.name}</Text>
            <Text style={styles.billingAddress}>{company.address}</Text>
            <Text style={styles.billingAddress}>{company.state} ({company.stateCode})</Text>
          </View>
        </View>

        {/* Transport Info */}
        {(options.transportMode || options.vehicleNo) && (
          <View style={styles.transportInfo}>
            {options.transportMode && (
              <Text style={styles.transportText}>Transport Mode: {options.transportMode.charAt(0).toUpperCase() + options.transportMode.slice(1)}</Text>
            )}
            {options.vehicleNo && (
              <Text style={styles.transportText}>Vehicle No: {options.vehicleNo}</Text>
            )}
          </View>
        )}

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Sl No.</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Description of Goods</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>HSN/SAC</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Quantity</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Rate</Text>
            <Text style={[styles.tableHeaderCell, styles.col6]}>per</Text>
            <Text style={[styles.tableHeaderCell, styles.col7]}>Amount</Text>
          </View>
          {items.map((item, index) => {
            const baseAmount = item.item.rate * item.quantity;
            const taxableAmount = baseAmount * (1 - item.discount / 100);
            
            return (
              <View key={item.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col1]}>{index + 1}</Text>
                <Text style={[styles.tableCell, styles.col2]}>{item.item.name}</Text>
                <Text style={[styles.tableCell, styles.col3]}>{item.item.hsn}</Text>
                <Text style={[styles.tableCell, styles.col4]}>
                  {item.quantity.toFixed(3)} {item.item.unit}
                </Text>
                <Text style={[styles.tableCell, styles.col5]}>
                  {item.item.rate.toFixed(2)}
                </Text>
                <Text style={[styles.tableCell, styles.col6]}>
                  {item.item.unit}
                </Text>
                <Text style={[styles.tableCell, styles.col7]}>
                  ₹{taxableAmount.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Bank Details & Summary */}
        <View style={styles.summarySection}>
          <View style={styles.bankBox}>
            <Text style={styles.bankTitle}>Bank Details for Payment</Text>
            <Text style={styles.bankText}>Bank: {bankDetails.bankName}</Text>
            <Text style={styles.bankText}>A/C Name: {bankDetails.accountName}</Text>
            <Text style={styles.bankText}>A/C No: {bankDetails.accountNumber}</Text>
            <Text style={styles.bankText}>IFSC: {bankDetails.ifscCode}</Text>
            <Text style={styles.bankText}>Branch: {bankDetails.branch}</Text>
          </View>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
            </View>
            {isSameState ? (
              <>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>CGST</Text>
                  <Text style={styles.summaryValue}>₹{(totalGst / 2).toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>SGST</Text>
                  <Text style={styles.summaryValue}>₹{(totalGst / 2).toLocaleString()}</Text>
                </View>
              </>
            ) : (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>IGST</Text>
                <Text style={styles.summaryValue}>₹{totalGst.toLocaleString()}</Text>
              </View>
            )}
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Invoice Total</Text>
              <Text style={styles.summaryValue}>₹{grandTotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Previous Balance</Text>
              <Text style={styles.summaryValue}>₹{previousBalance.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>₹{totalPayable.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {options.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes / Remarks</Text>
            <Text style={styles.notesText}>{options.notes}</Text>
          </View>
        )}

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>1. Payment is due by {formatDueDate(options.dueDate) || 'the specified due date'}.</Text>
          <Text style={styles.termsText}>2. Please quote invoice number when remitting payment.</Text>
          <Text style={styles.termsText}>3. Goods once sold will not be taken back or exchanged.</Text>
          <Text style={styles.termsText}>4. Subject to {sellerInfo.city} jurisdiction only.</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a computer-generated invoice and does not require a signature.
          </Text>
          <Text style={styles.footerText}>
            For any queries, please contact: {sellerInfo.email} | {sellerInfo.phone}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
