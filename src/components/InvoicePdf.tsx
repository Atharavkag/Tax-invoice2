import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define interfaces for type safety (extended to support more fields from the template)
interface InvoiceItem {
  slNo: number;
  description: string;
  hsnSac: string;
  quantity: string;
  rate: number;
  unit: string;
  amount: number;
}

interface CompanyDetails {
  name: string;
  address: string[];
  gstin: string;
  state: string;
  stateCode: string;
  contact: string[];
  email: string;
  website: string;
  logo?: string;
  pan?: string; // Added for completeness
}

interface BuyerDetails {
  name: string;
  address: string[];
  gstin: string;
  pan: string;
  state: string;
  stateCode: string;
  placeOfSupply: string;
}

interface InvoiceDetails {
  invoiceNo: string;
  invoiceDate: string;
  eWayBillNo?: string;
  deliveryNote?: string;
  referenceNo?: string;
  buyerOrderNo?: string;
  dispatchDocNo?: string;
  dispatchedThrough?: string;
  billOfLadingNo?: string;
  billOfLadingDate?: string;
  modeOfPayment: string;
  otherReferences?: string;
  deliveryNoteDate?: string;
  destination?: string;
  motorVehicleNo?: string;
  termsOfDelivery?: string;
  buyerOrderDate?: string;
}

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNo: string;
  branchAndIFSC: string;
  swiftCode?: string;
}

interface InvoicePdfProps {
  company: CompanyDetails;
  buyer: BuyerDetails;
  invoiceDetails: InvoiceDetails;
  items: InvoiceItem[];
  igstRate: number;
  previousBalance?: number;
  bankDetails: BankDetails;
  qrCode?: string;
  notes?: string;
}

// Number to words conversion (INR with paise support)
const numberToWords = (num: number): string => {
  if (num === 0) return 'Zero';
  const whole = Math.floor(num);
  const paise = Math.round((num - whole) * 100);
  let str = convertWholeToWords(whole);
  if (paise > 0) {
    str += ' and ' + convertWholeToWords(paise) + ' paise';
  }
  return str + ' Only';
};

const convertWholeToWords = (n: number): string => {
  const a = [
    'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  if (n < 20) return a[n];
  if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
  if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convertWholeToWords(n % 100) : '');
  if (n < 100000) return convertWholeToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convertWholeToWords(n % 1000) : '');
  if (n < 10000000) return convertWholeToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convertWholeToWords(n % 100000) : '');
  return convertWholeToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convertWholeToWords(n % 10000000) : '');
};

// Create comprehensive styles to match the template layout
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    padding: 20,
  },
  container: {
    border: '2px solid #000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottom: '1px solid #000',
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  headerSubtext: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    border: '1px solid #000',
    padding: 2,
    marginLeft: 10,
  },
  topSection: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  sellerSection: {
    width: '50%',
    padding: 10,
    borderRight: '1px solid #000',
  },
  companyName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  companyDetail: {
    fontSize: 8,
    marginBottom: 2,
  },
  boldLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  invoiceDetailsSection: {
    width: '50%',
    flexDirection: 'column',
  },
  detailRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  detailCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1px solid #000',
    flex: 1,
  },
  detailCellLast: {
    padding: 5,
    fontSize: 8,
    flex: 1,
  },
  detailLabel: {
    fontFamily: 'Helvetica-Bold',
    width: '40%',
  },
  detailValue: {
    width: '60%',
  },
  buyerSection: {
    padding: 10,
    borderBottom: '1px solid #000',
  },
  dispatchSection: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  dispatchLeft: {
    width: '50%',
    padding: 10,
    borderRight: '1px solid #000',
  },
  dispatchRight: {
    width: '50%',
    padding: 10,
  },
  tableSection: {
    borderBottom: '1px solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    backgroundColor: '#f0f0f0',
  },
  tableHeaderCell: {
    padding: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    borderRight: '1px solid #000',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1px solid #000',
  },
  taxRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  taxCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1px solid #000',
  },
  totalsSection: {
    padding: 10,
    borderBottom: '1px solid #000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 8,
  },
  totalLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  totalValue: {
    fontFamily: 'Helvetica-Bold',
  },
  amountInWords: {
    padding: 10,
    borderBottom: '1px solid #000',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amountLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  amountValue: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },
  hsnTable: {
    flexDirection: 'row',
    border: '1px solid #000',
    borderBottom: 'none',
  },
  hsnHeaderCell: {
    padding: 5,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    borderRight: '1px solid #000',
    textAlign: 'center',
    flex: 1,
  },
  hsnRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  hsnCell: {
    padding: 5,
    fontSize: 8,
    borderRight: '1px solid #000',
    flex: 1,
    textAlign: 'center',
  },
  balanceSection: {
    padding: 10,
    borderBottom: '1px solid #000',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qrBankSection: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  qrSection: {
    width: '40%',
    padding: 10,
    borderRight: '1px solid #000',
    alignItems: 'center',
  },
  bankSection: {
    width: '60%',
    padding: 10,
  },
  bankDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bankLabel: {
    width: '50%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
  },
  bankValue: {
    width: '50%',
    fontSize: 8,
  },
  declarationSection: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  declarationLeft: {
    width: '60%',
    padding: 10,
    borderRight: '1px solid #000',
  },
  signatureRight: {
    width: '40%',
    padding: 10,
    textAlign: 'center',
  },
  signatureLine: {
    borderTop: '1px solid #000',
    marginTop: 40,
    width: '80%',
    marginHorizontal: 'auto',
  },
  footer: {
    padding: 5,
    fontSize: 7,
    textAlign: 'center',
    borderTop: '1px solid #000',
  },
  eoe: {
    fontSize: 8,
    textAlign: 'right',
    paddingRight: 10,
    marginBottom: 5,
  },
});

const InvoicePdf: React.FC<InvoicePdfProps> = ({
  company,
  buyer,
  invoiceDetails,
  items,
  igstRate,
  previousBalance = 0,
  bankDetails,
  qrCode,
  notes,
}) => {
  // Safe calculation
  const calculateTotals = () => {
    try {
      const subtotal = Array.isArray(items) && items.length > 0
        ? items.reduce((sum, item) => sum + (item.amount || 0), 0)
        : 0;
      const igstAmount = (subtotal * (igstRate || 0)) / 100;
      const roundOff = Math.round((subtotal + igstAmount) * 100) / 100 - (subtotal + igstAmount);
      const grandTotal = subtotal + igstAmount + roundOff;
      const currentBalance = (previousBalance || 0) + grandTotal;

      return {
        subtotal,
        igstAmount,
        roundOff,
        grandTotal,
        currentBalance,
      };
    } catch (error) {
      console.error('Error calculating totals:', error);
      return {
        subtotal: 0,
        igstAmount: 0,
        roundOff: 0,
        grandTotal: 0,
        currentBalance: previousBalance || 0,
      };
    }
  };

  const { subtotal, igstAmount, roundOff, grandTotal, currentBalance } = calculateTotals();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              Tax Invoice <Text style={styles.headerSubtext}>(ORIGINAL FOR RECIPIENT)</Text>
            </Text>
          </View>

          {/* Top Section - Seller & Invoice Details */}
          <View style={styles.topSection}>
            {/* Seller Details */}
            <View style={styles.sellerSection}>
              <Text style={styles.companyName}>{company?.name || ''}</Text>
              {Array.isArray(company?.address) && company.address.map((line, idx) => (
                <Text key={idx} style={styles.companyDetail}>{line || ''}</Text>
              ))}
              {company?.gstin && (
                <Text style={styles.companyDetail}>
                  <Text style={styles.boldLabel}>GSTIN/UIN: </Text>{company.gstin}
                </Text>
              )}
              {company?.state && (
                <Text style={styles.companyDetail}>
                  <Text style={styles.boldLabel}>State Name: </Text>{company.state} {company.stateCode ? `, Code : ${company.stateCode}` : ''}
                </Text>
              )}
              {Array.isArray(company?.contact) && company.contact.length > 0 && (
                <Text style={styles.companyDetail}>
                  <Text style={styles.boldLabel}>Contact: </Text>{company.contact.filter(Boolean).join(', ')}
                </Text>
              )}
              {company?.email && (
                <Text style={styles.companyDetail}>
                  <Text style={styles.boldLabel}>E-Mail: </Text>{company.email}
                </Text>
              )}
              {company?.website && (
                <Text style={styles.companyDetail}>{company.website}</Text>
              )}
              {company?.pan && (
                <Text style={styles.companyDetail}>
                  <Text style={styles.boldLabel}>PAN/IT No.: </Text>{company.pan}
                </Text>
              )}
            </View>

            {/* Invoice Details Table */}
            <View style={styles.invoiceDetailsSection}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Invoice No.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails?.invoiceNo || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>e-Way Bill No.</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails?.eWayBillNo || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Delivery Note</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails?.deliveryNote || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Dated</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails?.invoiceDate || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailCell, styles.detailLabel]}>Reference No. & Date.</Text>
                <Text style={[styles.detailCell, styles.detailValue]}>{invoiceDetails?.referenceNo || ''}</Text>
                <Text style={[styles.detailCell, styles.detailLabel]}>Mode/Terms of Payment</Text>
                <Text style={[styles.detailCellLast, styles.detailValue]}>{invoiceDetails?.modeOfPayment || ''}</Text>
              </View>
            </View>
          </View>

          {/* Buyer Details */}
          <View style={styles.buyerSection}>
            <Text style={styles.boldLabel}>Buyer (Bill To)</Text>
            <Text style={styles.companyDetail}>{buyer?.name || ''}</Text>
            {Array.isArray(buyer?.address) && buyer.address.map((line, idx) => (
              <Text key={idx} style={styles.companyDetail}>{line || ''}</Text>
            ))}
            {buyer?.gstin && (
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>GSTIN: </Text>{buyer.gstin}
              </Text>
            )}
            {buyer?.state && (
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>State Name: </Text>{buyer.state} {buyer.stateCode ? `, Code : ${buyer.stateCode}` : ''}
              </Text>
            )}
            {buyer?.placeOfSupply && (
              <Text style={styles.companyDetail}>
                <Text style={styles.boldLabel}>Place of Supply: </Text>{buyer.placeOfSupply}
              </Text>
            )}
          </View>

          {/* Dispatch Details */}
          <View style={styles.dispatchSection}>
            <View style={styles.dispatchLeft}>
              <Text style={styles.boldLabel}>Buyer's Order No.</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.buyerOrderNo || ''}</Text>
              <Text style={styles.boldLabel}>Dispatch Doc No.</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.dispatchDocNo || ''}</Text>
              <Text style={styles.boldLabel}>Dispatched through</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.dispatchedThrough || ''}</Text>
              <Text style={styles.boldLabel}>Bill of Lading/LR-RR No.</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.billOfLadingNo || ''}</Text>
              <Text style={styles.boldLabel}>Terms of Delivery</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.termsOfDelivery || ''}</Text>
            </View>
            <View style={styles.dispatchRight}>
              <Text style={styles.boldLabel}>Dated</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.buyerOrderDate || ''}</Text>
              <Text style={styles.boldLabel}>Delivery Note Date</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.deliveryNoteDate || ''}</Text>
              <Text style={styles.boldLabel}>Destination</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.destination || ''}</Text>
              <Text style={styles.boldLabel}>Motor Vehicle No.</Text>
              <Text style={styles.companyDetail}>{invoiceDetails?.motorVehicleNo || ''}</Text>
            </View>
          </View>

          {/* Items Table */}
          {Array.isArray(items) && items.length > 0 && (
            <View style={styles.tableSection}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: '5%' }]}>Sl No.</Text>
                <Text style={[styles.tableHeaderCell, { width: '30%' }]}>Description of Goods</Text>
                <Text style={[styles.tableHeaderCell, { width: '12%' }]}>HSN/SAC</Text>
                <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Quantity</Text>
                <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Rate</Text>
                <Text style={[styles.tableHeaderCell, { width: '8%' }]}>per</Text>
                <Text style={[styles.tableHeaderCell, { width: '21%' }]}>Amount</Text>
              </View>
              {items.map((item, idx) => (
                <View key={idx} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: '5%' }]}>{item.slNo || idx + 1}</Text>
                  <Text style={[styles.tableCell, { width: '30%' }]}>{item.description || ''}</Text>
                  <Text style={[styles.tableCell, { width: '12%' }]}>{item.hsnSac || ''}</Text>
                  <Text style={[styles.tableCell, { width: '12%' }]}>{item.quantity || '0'}</Text>
                  <Text style={[styles.tableCell, { width: '12%' }]}>{item.rate.toFixed(2)}</Text>
                  <Text style={[styles.tableCell, { width: '8%' }]}>{item.unit || ''}</Text>
                  <Text style={[styles.tableCell, { width: '21%', textAlign: 'right' }]}>{item.amount.toFixed(2)}</Text>
                </View>
              ))}

              {/* Tax Rows (IGST, Round Off) */}
              <View style={styles.taxRow}>
                <Text style={[styles.taxCell, { width: '5%' }]}></Text>
                <Text style={[styles.taxCell, { width: '54%' }]}>IGST @ {igstRate}% ROUND OFF</Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '8%' }]}></Text>
                <Text style={[styles.taxCell, { width: '21%', textAlign: 'right' }]}>{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={[styles.taxCell, { width: '5%' }]}></Text>
                <Text style={[styles.taxCell, { width: '54%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}>{igstRate}%</Text>
                <Text style={[styles.taxCell, { width: '8%' }]}></Text>
                <Text style={[styles.taxCell, { width: '21%', textAlign: 'right' }]}>{igstAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.taxRow}>
                <Text style={[styles.taxCell, { width: '5%' }]}></Text>
                <Text style={[styles.taxCell, { width: '54%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '12%' }]}></Text>
                <Text style={[styles.taxCell, { width: '8%' }]}></Text>
                <Text style={[styles.taxCell, { width: '21%', textAlign: 'right' }]}>{roundOff.toFixed(2)}</Text>
              </View>

              {/* Grand Total Row */}
              <View style={[styles.tableRow, { backgroundColor: '#f0f0f0' }]}>
                <Text style={[styles.tableCell, { width: '79%' }]}>Total</Text>
                <Text style={[styles.tableCell, { width: '21%', textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                  ₹{grandTotal.toFixed(2)}
                </Text>
              </View>
            </View>
          )}

          {/* Amount Chargeable (in words) */}
          <View style={styles.amountInWords}>
            <Text style={styles.amountLabel}>Amount Chargeable (in words)</Text>
            <Text style={styles.amountValue}>INR {numberToWords(grandTotal)}</Text>
          </View>

          {/* HSN/SAC Summary Table */}
          <View style={{ marginTop: 10 }}>
            <View style={styles.hsnTable}>
              <Text style={[styles.hsnHeaderCell, { width: '20%' }]}>HSN/SAC</Text>
              <Text style={[styles.hsnHeaderCell, { width: '20%' }]}>Taxable Value</Text>
              <Text style={[styles.hsnHeaderCell, { width: '20%' }]}>Rate</Text>
              <Text style={[styles.hsnHeaderCell, { width: '20%' }]}>Amount</Text>
              <Text style={[styles.hsnHeaderCell, { width: '20%' }]}>Tax Amount</Text>
            </View>
            <View style={styles.hsnRow}>
              <Text style={[styles.hsnCell, { width: '20%' }]}>{items.length > 0 ? items[0].hsnSac || '' : ''}</Text>
              <Text style={[styles.hsnCell, { width: '20%' }]}>{subtotal.toFixed(2)}</Text>
              <Text style={[styles.hsnCell, { width: '20%' }]}>{igstRate}%</Text>
              <Text style={[styles.hsnCell, { width: '20%' }]}>{igstAmount.toFixed(2)}</Text>
              <Text style={[styles.hsnCell, { width: '20%' }]}>{igstAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Tax Amount (in words) */}
          <View style={styles.amountInWords}>
            <Text style={styles.amountLabel}>Tax Amount (in words)</Text>
            <Text style={styles.amountValue}>INR {numberToWords(igstAmount)}</Text>
          </View>

          {/* Previous & Current Balance */}
          <View style={styles.balanceSection}>
            <View>
              <Text style={styles.boldLabel}>Previous Balance: </Text>
              <Text>₹{(previousBalance || 0).toFixed(2)} Dr</Text>
            </View>
            <View>
              <Text style={styles.boldLabel}>Current Balance: </Text>
              <Text>₹{currentBalance.toFixed(2)} Dr</Text>
            </View>
          </View>

          {/* QR Code & Bank Details */}
          <View style={styles.qrBankSection}>
            <View style={styles.qrSection}>
              {qrCode && <Image src={qrCode} style={{ width: 80, height: 80 }} />}
              <Text style={{ fontSize: 7, marginTop: 5 }}>Scan to pay</Text>
            </View>
            <View style={styles.bankSection}>
              <Text style={[styles.boldLabel, { marginBottom: 8 }]}>Company's Bank Details</Text>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankLabel}>A/c Holder's Name:</Text>
                <Text style={styles.bankValue}>{bankDetails?.accountHolderName || ''}</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankLabel}>Bank Name:</Text>
                <Text style={styles.bankValue}>{bankDetails?.bankName || ''}</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankLabel}>A/c No.:</Text>
                <Text style={styles.bankValue}>{bankDetails?.accountNo || ''}</Text>
              </View>
              <View style={styles.bankDetailRow}>
                <Text style={styles.bankLabel}>Branch & IFSC Code:</Text>
                <Text style={styles.bankValue}>{bankDetails?.branchAndIFSC || ''}</Text>
              </View>
              {bankDetails?.swiftCode && (
                <View style={styles.bankDetailRow}>
                  <Text style={styles.bankLabel}>SWIFT Code:</Text>
                  <Text style={styles.bankValue}>{bankDetails.swiftCode}</Text>
                </View>
              )}
              <Text style={styles.eoe}>E & O E</Text>
            </View>
          </View>

          {/* Declaration & Signature */}
          <View style={styles.declarationSection}>
            <View style={styles.declarationLeft}>
              <Text style={styles.boldLabel}>Declaration</Text>
              <Text style={{ fontSize: 7 }}>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </Text>
            </View>
            <View style={styles.signatureRight}>
              <Text style={styles.boldLabel}>for {company?.name || ''}</Text>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 7, marginTop: 5 }}>Authorised Signatory</Text>
              <Text style={{ fontSize: 7, marginTop: 10 }}>Sunshine Industries</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>This is a Computer Generated Invoice</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
