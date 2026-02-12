import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface InvoiceItem {
  slNo: number;
  description: string;
  hsnSac: string;
  quantity: string;
  rate: number;
  unit: string;
  amount: number;
}

interface InvoicePdfProps {
  company: any;
  buyer: any;
  invoiceDetails: any;
  items: InvoiceItem[];
  igstRate: number;
  previousBalance?: number;
  bankDetails: any;
  qrCode?: string;
  logo?: string;
}

// Enhanced Number to Words Function
const numberToWords = (num: number): string => {
  if (num === 0) return "Zero Only";
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };
  
  const convertNumber = (n: number): string => {
    if (n === 0) return '';
    if (n < 1000) return convertLessThanThousand(n);
    if (n < 100000) {
      const thousands = Math.floor(n / 1000);
      const remainder = n % 1000;
      return convertLessThanThousand(thousands) + ' Thousand' + (remainder !== 0 ? ' ' + convertLessThanThousand(remainder) : '');
    }
    if (n < 10000000) {
      const lakhs = Math.floor(n / 100000);
      const remainder = n % 100000;
      return convertLessThanThousand(lakhs) + ' Lakh' + (remainder !== 0 ? ' ' + convertNumber(remainder) : '');
    }
    const crores = Math.floor(n / 10000000);
    const remainder = n % 10000000;
    return convertLessThanThousand(crores) + ' Crore' + (remainder !== 0 ? ' ' + convertNumber(remainder) : '');
  };
  
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let result = 'INR ' + convertNumber(rupees);
  if (paise > 0) {
    result += ' and ' + convertNumber(paise) + ' Paise';
  }
  return result + ' Only';
};

const styles = StyleSheet.create({
  page: { 
    fontFamily: 'Helvetica', 
    fontSize: 8, 
    padding: 15
  },
  
  // Header outside the box
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 5
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    flex: 1
  },
  headerSubtext: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    position: 'absolute',
    right: 0
  },
  
  // Main container with border
  container: { 
    border: '2px solid black'
  },
  
  // Top section - Company and Invoice Details
  topSection: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black' 
  },
  companySection: { 
    width: '50%', 
    padding: 8, 
    borderRight: '1px solid black',
    flexDirection: 'row'
  },
  logoContainer: {
    width: 60,
    marginRight: 8
  },
  logo: {
    width: 55,
    height: 55
  },
  companyDetails: {
    flex: 1
  },
  invoiceDetailsSection: { 
    width: '50%'
  },
  
  companyName: { 
    fontSize: 11, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 2 
  },
  companyAddress: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.3
  },
  companyInfo: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.3
  },
  bold: { 
    fontFamily: 'Helvetica-Bold' 
  },
  
  // Invoice details grid
  detailRow: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 14
  },
  detailRowLast: {
    flexDirection: 'row',
    minHeight: 14
  },
  detailLabel: { 
    width: '45%', 
    padding: 3, 
    fontFamily: 'Helvetica-Bold', 
    fontSize: 7,
    borderRight: '1px solid black',
    justifyContent: 'center'
  },
  detailValue: { 
    width: '55%', 
    padding: 3, 
    fontSize: 7,
    justifyContent: 'center'
  },
  
  // Buyer/Consignee section
  buyerConsigneeSection: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black' 
  },
  buyerSection: { 
    width: '50%', 
    padding: 8, 
    borderRight: '1px solid black' 
  },
  consigneeSection: { 
    width: '50%', 
    padding: 8 
  },
  sectionTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 3 
  },
  buyerName: { 
    fontSize: 9, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 2 
  },
  buyerAddress: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.3
  },
  buyerInfo: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.3
  },
  
  // Table styles
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f5f5f5', 
    borderBottom: '1px solid black',
    fontFamily: 'Helvetica-Bold',
    minHeight: 20
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 18
  },
  th: { 
    padding: 3, 
    fontSize: 7, 
    textAlign: 'center', 
    borderRight: '1px solid black',
    fontFamily: 'Helvetica-Bold',
    justifyContent: 'center',
    alignItems: 'center'
  },
  td: { 
    padding: 3, 
    fontSize: 7, 
    borderRight: '1px solid black',
    justifyContent: 'center'
  },
  tdCenter: {
    textAlign: 'center',
    alignItems: 'center'
  },
  tdRight: {
    textAlign: 'right',
    paddingRight: 5
  },
  tdLeft: {
    textAlign: 'left',
    paddingLeft: 5
  },
  
  // Tax and total rows
  taxRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 30
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid black',
    fontFamily: 'Helvetica-Bold',
    minHeight: 16
  },
  
  // Amount in words
  amountInWords: { 
    padding: 6, 
    borderBottom: '1px solid black',
    fontSize: 7,
    lineHeight: 1.4
  },
  amountInWordsLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2
  },
  
  // HSN/Balance section
  hsnBalanceSection: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    fontSize: 7
  },
  hsnLabel: {
    width: '10%',
    borderRight: '1px solid black',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  balanceTable: {
    width: '90%',
    flexDirection: 'column'
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    backgroundColor: '#f5f5f5'
  },
  balanceDataRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black'
  },
  balanceTotalRow: {
    flexDirection: 'row'
  },
  balanceCell: {
    padding: 3,
    borderRight: '1px solid black',
    fontSize: 7,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  balanceCellLabel: {
    fontFamily: 'Helvetica-Bold'
  },
  
  // Tax amount in words
  taxAmountWords: {
    padding: 6,
    borderBottom: '1px solid black',
    fontSize: 7,
    lineHeight: 1.4
  },
  
  // Bank and QR section
  bankQrSection: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 90
  },
  qrSection: { 
    width: '15%', 
    padding: 8, 
    borderRight: '1px solid black', 
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  bankSection: { 
    width: '85%', 
    padding: 8,
    flexDirection: 'column'
  },
  qrImage: { 
    width: 55, 
    height: 55,
    marginBottom: 3
  },
  qrText: { 
    fontSize: 6, 
    textAlign: 'center' 
  },
  bankTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 4 
  },
  bankDetail: { 
    fontSize: 7, 
    marginBottom: 2,
    lineHeight: 1.3
  },
  
  // Declaration and signature
  declarationSection: { 
    flexDirection: 'row',
    minHeight: 70
  },
  declarationLeft: { 
    width: '60%', 
    padding: 8,
    borderRight: '1px solid black'
  },
  signatureRight: { 
    width: '40%', 
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  declarationTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 3 
  },
  declarationText: { 
    fontSize: 7,
    lineHeight: 1.4
  },
  signatureCompany: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 35
  },
  signatureLine: {
    fontSize: 7
  },
  
  // Footer - OUTSIDE the box
  footer: { 
    padding: 6, 
    textAlign: 'center', 
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 5
  }
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
  logo
}) => {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const igst = (subtotal * igstRate) / 100;
  const roundOff = Math.round(subtotal + igst) - (subtotal + igst);
  const totalTax = igst;
  const grandTotal = Math.round(subtotal + igst);
  const currentBalance = previousBalance + grandTotal;
  const totalQuantity = items.reduce((sum, item) => sum + parseFloat(item.quantity || '0'), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header OUTSIDE the bordered box */}
        <View style={styles.pageHeader}>
          <View style={{ width: '25%' }}></View>
          <Text style={styles.headerTitle}>Tax Invoice</Text>
          <Text style={styles.headerSubtext}>(ORIGINAL FOR RECIPIENT)</Text>
        </View>

        {/* Main bordered container */}
        <View style={styles.container}>

          {/* Seller Details + Invoice Details */}
          <View style={styles.topSection}>
            {/* Left - Company Details with Logo */}
            <View style={styles.companySection}>
              <View style={styles.logoContainer}>
                {logo ? (
                  <Image src={logo} style={styles.logo} />
                ) : (
                  <View style={styles.logo}></View>
                )}
              </View>
              <View style={styles.companyDetails}>
                <Text style={styles.companyName}>{company?.name || "Company Name"}</Text>
                {company?.address?.map((line: string, i: number) => (
                  <Text key={i} style={styles.companyAddress}>{line}</Text>
                ))}
                <Text style={styles.companyInfo}>
                  <Text style={styles.bold}>GSTIN/UIN: </Text>{company?.gstin || ""}
                </Text>
                <Text style={styles.companyInfo}>
                  <Text style={styles.bold}>State Name: </Text>{company?.state || ""}, Code: {company?.stateCode || ""}
                </Text>
                <Text style={styles.companyInfo}>
                  <Text style={styles.bold}>Contact: </Text>{company?.contact?.join(", ") || ""}
                </Text>
                <Text style={styles.companyInfo}>
                  <Text style={styles.bold}>E-Mail: </Text>{company?.email || ""}
                </Text>
              </View>
            </View>

            {/* Right - Invoice Details */}
            <View style={styles.invoiceDetailsSection}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice No.</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.invoiceNo || ""}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>e-Way Bill No.</Text>
                <Text style={styles.detailValue}>Dated</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dated</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.date || ""}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Delivery Note</Text>
                <Text style={styles.detailValue}></Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Mode/Terms of Payment</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.paymentTerms || "IMMEDIATE"}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Reference No. & Date.</Text>
                <Text style={styles.detailValue}>Other References</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Buyer's Order No.</Text>
                <Text style={styles.detailValue}>Dated</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dispatch Doc No.</Text>
                <Text style={styles.detailValue}>Delivery Note Date</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dispatched through</Text>
                <Text style={styles.detailValue}>Destination</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bill of Lading/LR-RR No.</Text>
                <Text style={styles.detailValue}>Motor Vehicle No.</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>dt. 2-Feb-26</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.vehicleNo || "DD01AC9646"}</Text>
              </View>
              <View style={styles.detailRowLast}>
                <Text style={styles.detailLabel}>Terms of Delivery</Text>
                <Text style={styles.detailValue}></Text>
              </View>
            </View>
          </View>

          {/* Buyer and Consignee */}
          <View style={styles.buyerConsigneeSection}>
            {/* Buyer (Bill to) */}
            <View style={styles.buyerSection}>
              <Text style={styles.sectionTitle}>Buyer (Bill to)</Text>
              <Text style={styles.buyerName}>{buyer?.name || ""}</Text>
              {buyer?.address?.map((line: string, i: number) => (
                <Text key={i} style={styles.buyerAddress}>{line}</Text>
              ))}
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>GSTIN/UIN: </Text>{buyer?.gstin || ""}
              </Text>
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>State Name: </Text>{buyer?.state || ""}, Code: {buyer?.stateCode || ""}
              </Text>
            </View>

            {/* Consignee (Ship to) */}
            <View style={styles.consigneeSection}>
              <Text style={styles.sectionTitle}>Consignee (Ship to)</Text>
              <Text style={styles.buyerName}>{buyer?.consigneeName || buyer?.name || ""}</Text>
              {(buyer?.consigneeAddress || buyer?.address)?.map((line: string, i: number) => (
                <Text key={i} style={styles.buyerAddress}>{line}</Text>
              ))}
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>GSTIN/UIN: </Text>{buyer?.consigneeGstin || buyer?.gstin || ""}
              </Text>
              <Text style={styles.buyerInfo}>
                <Text style={styles.bold}>State Name: </Text>{buyer?.consigneeState || buyer?.state || ""}, Code: {buyer?.consigneeStateCode || buyer?.stateCode || ""}
              </Text>
            </View>
          </View>

          {/* Items Table */}
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: '5%' }]}>SI{'\n'}No.</Text>
              <Text style={[styles.th, { width: '33%' }]}>Description of Goods</Text>
              <Text style={[styles.th, { width: '10%' }]}>HSN/SAC</Text>
              <Text style={[styles.th, { width: '12%' }]}>Quantity</Text>
              <Text style={[styles.th, { width: '10%' }]}>Rate</Text>
              <Text style={[styles.th, { width: '6%' }]}>per</Text>
              <Text style={[styles.th, { width: '12%', borderRight: 'none' }]}>Amount</Text>
            </View>

            {/* Table Rows */}
            {items.map((item, i) => (
              <View style={styles.tableRow} key={i}>
                <Text style={[styles.td, styles.tdCenter, { width: '5%' }]}>{i + 1}</Text>
                <Text style={[styles.td, styles.tdLeft, { width: '33%' }]}>
                  <Text style={styles.bold}>{item.description.split('\n')[0]}</Text>
                  {item.description.includes('\n') && '\n' + item.description.split('\n').slice(1).join('\n')}
                </Text>
                <Text style={[styles.td, styles.tdCenter, { width: '10%' }]}>{item.hsnSac}</Text>
                <Text style={[styles.td, styles.tdRight, { width: '12%' }]}>{item.quantity}</Text>
                <Text style={[styles.td, styles.tdRight, { width: '10%' }]}>{item.rate.toFixed(2)}</Text>
                <Text style={[styles.td, styles.tdCenter, { width: '6%' }]}>{item.unit}</Text>
                <Text style={[styles.td, styles.tdRight, { width: '12%', borderRight: 'none' }]}>
                  {item.amount.toFixed(2)}
                </Text>
              </View>
            ))}

            {/* Blank rows for spacing */}
            {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
              <View style={styles.tableRow} key={`blank-${i}`}>
                <Text style={[styles.td, { width: '5%' }]}> </Text>
                <Text style={[styles.td, { width: '33%' }]}> </Text>
                <Text style={[styles.td, { width: '10%' }]}> </Text>
                <Text style={[styles.td, { width: '12%' }]}> </Text>
                <Text style={[styles.td, { width: '10%' }]}> </Text>
                <Text style={[styles.td, { width: '6%' }]}> </Text>
                <Text style={[styles.td, { width: '12%', borderRight: 'none' }]}> </Text>
              </View>
            ))}

            {/* Tax Row */}
            <View style={styles.taxRow}>
              <Text style={[styles.td, { width: '60%', paddingLeft: 20 }]}>
                <Text style={styles.bold}>IGST @{igstRate}%</Text>{'\n'}
                <Text style={styles.bold}>ROUND OFF</Text>
              </Text>
              <Text style={[styles.td, styles.tdCenter, { width: '28%' }]}>{igstRate}%</Text>
              <Text style={[styles.td, styles.tdRight, { width: '12%', borderRight: 'none' }]}>
                {igst.toFixed(2)}{'\n'}
                {roundOff.toFixed(2)}
              </Text>
            </View>

            {/* Total Row */}
            <View style={styles.totalRow}>
              <Text style={[styles.td, { width: '60%', fontFamily: 'Helvetica-Bold', fontSize: 8, paddingLeft: 20 }]}>
                Total
              </Text>
              <Text style={[styles.td, styles.tdRight, { width: '28%', fontFamily: 'Helvetica-Bold' }]}>
                {totalQuantity.toFixed(2)} kg
              </Text>
              <Text style={[styles.td, styles.tdRight, { width: '12%', borderRight: 'none', fontFamily: 'Helvetica-Bold', fontSize: 8 }]}>
                ₹ {grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Amount Chargeable in Words */}
          <View style={styles.amountInWords}>
            <Text style={styles.amountInWordsLabel}>Amount Chargeable (in words)</Text>
            <Text style={styles.bold}>{numberToWords(grandTotal)}</Text>
          </View>

          {/* HSN/SAC and Balance Section */}
          <View style={styles.hsnBalanceSection}>
            <View style={styles.hsnLabel}>
              <Text style={{ fontSize: 7, transform: 'rotate(-90deg)', width: 60 }}>
                HSN/SAC
              </Text>
            </View>
            <View style={styles.balanceTable}>
              {/* Header Row */}
              <View style={styles.balanceHeaderRow}>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '18%' }]}>
                  Taxable{'\n'}Value
                </Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '8%' }]}>
                  Rate
                </Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '12%' }]}>
                  Amount
                </Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '12%' }]}>
                  Tax Amount
                </Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '22%' }]}>
                  Previous Balance:
                </Text>
                <Text style={[styles.balanceCell, { width: '28%', borderRight: 'none', textAlign: 'left', paddingLeft: 5 }]}>
                  ₹ {previousBalance.toFixed(2)} Dr
                </Text>
              </View>
              
              {/* Data Row */}
              <View style={styles.balanceDataRow}>
                <Text style={[styles.balanceCell, { width: '18%' }]}>
                  {subtotal.toFixed(2)}
                </Text>
                <Text style={[styles.balanceCell, { width: '8%' }]}>
                  {igstRate}%
                </Text>
                <Text style={[styles.balanceCell, { width: '12%' }]}>
                  {igst.toFixed(2)}
                </Text>
                <Text style={[styles.balanceCell, { width: '12%' }]}>
                  {totalTax.toFixed(2)}
                </Text>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '22%' }]}>
                  Current Balance:
                </Text>
                <Text style={[styles.balanceCell, { width: '28%', borderRight: 'none', textAlign: 'left', paddingLeft: 5 }]}>
                  ₹ {currentBalance.toFixed(2)} Dr
                </Text>
              </View>
              
              {/* Total Row */}
              <View style={styles.balanceTotalRow}>
                <Text style={[styles.balanceCell, styles.balanceCellLabel, { width: '18%' }]}>
                  Total
                </Text>
                <Text style={[styles.balanceCell, { width: '8%' }]}></Text>
                <Text style={[styles.balanceCell, { width: '12%' }]}>
                  {subtotal.toFixed(2)}
                </Text>
                <Text style={[styles.balanceCell, { width: '12%' }]}>
                  {totalTax.toFixed(2)}
                </Text>
                <Text style={[styles.balanceCell, { width: '22%' }]}></Text>
                <Text style={[styles.balanceCell, { width: '28%', borderRight: 'none' }]}></Text>
              </View>
            </View>
          </View>

          {/* Tax Amount in Words */}
          <View style={styles.taxAmountWords}>
            <Text style={[styles.bold, { marginBottom: 2 }]}>Tax Amount (in words)  :  </Text>
            <Text style={styles.bold}>{numberToWords(totalTax)}</Text>
          </View>

          {/* Bank Details and QR Code */}
          <View style={styles.bankQrSection}>
            {/* QR Code */}
            <View style={styles.qrSection}>
              {qrCode ? (
                <Image src={qrCode} style={styles.qrImage} />
              ) : (
                <View style={{ width: 55, height: 55, border: '1px solid black', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 6 }}>QR</Text>
                </View>
              )}
              <Text style={styles.qrText}>Scan to pay</Text>
            </View>

            {/* Bank Details */}
            <View style={styles.bankSection}>
              <Text style={styles.bankTitle}>Company's Bank Details</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '70%' }}>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>A/c Holder's Name  :  </Text>
                    {bankDetails?.accountHolderName || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>Bank Name              :  </Text>
                    {bankDetails?.bankName || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>A/c No.                :  </Text>
                    {bankDetails?.accountNo || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>Branch & IFSC Code     :  </Text>
                    {bankDetails?.branchAndIFSC || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>SWIFT Code             :  </Text>
                    {bankDetails?.swiftCode || ""}
                  </Text>
                </View>
                <View style={{ width: '30%', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>E. & O.E</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Declaration and Signature */}
          <View style={styles.declarationSection}>
            {/* Declaration */}
            <View style={styles.declarationLeft}>
              <Text style={styles.declarationTitle}>Declaration</Text>
              <Text style={styles.declarationText}>
                We declare that this invoice shows the actual price of the goods{'\n'}
                described and that all particulars are true and correct.
              </Text>
            </View>

            {/* Signature */}
            <View style={styles.signatureRight}>
              <Text style={styles.signatureCompany}>for {company?.name || "Company Name"}</Text>
              <Text style={styles.signatureLine}>Authorised Signatory</Text>
            </View>
          </View>

        </View>

        {/* Footer OUTSIDE the bordered box */}
        <View style={styles.footer}>
          <Text>This is a Computer Generated Invoice</Text>
        </View>

      </Page>
    </Document>
  );
};

export default InvoicePdf;
