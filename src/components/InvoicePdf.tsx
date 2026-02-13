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
  
  // Header outside the box - SINGLE LINE
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 5
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold'
  },
  headerSubtext: {
    fontSize: 8,
    fontFamily: 'Helvetica'
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
    marginRight: 6
  },
  logo: {
    width: 50,
    height: 50
  },
  companyDetails: {
    flex: 1
  },
  invoiceDetailsSection: { 
    width: '50%'
  },
  
  companyName: { 
    fontSize: 10, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 2 
  },
  companyAddress: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.2
  },
  companyInfo: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.2
  },
  bold: { 
    fontFamily: 'Helvetica-Bold' 
  },
  
  // Invoice details grid
  detailRow: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 12
  },
  detailRowNoBorder: {
    flexDirection: 'row',
    minHeight: 12
  },
  detailLabel: { 
    width: '45%', 
    padding: 3, 
    fontFamily: 'Helvetica-Bold', 
    fontSize: 7,
    borderRight: '1px solid black',
    display: 'flex',
    alignItems: 'center'
  },
  detailValue: { 
    width: '55%', 
    padding: 3, 
    fontSize: 7,
    display: 'flex',
    alignItems: 'center'
  },
  
  // Buyer/Consignee section
  buyerConsigneeSection: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 80
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
    lineHeight: 1.2
  },
  buyerInfo: { 
    fontSize: 7, 
    marginBottom: 1,
    lineHeight: 1.2
  },
  
  // Table styles
  tableHeader: { 
    flexDirection: 'row', 
    backgroundColor: '#f5f5f5', 
    borderBottom: '1px solid black',
    fontFamily: 'Helvetica-Bold',
    minHeight: 18
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottom: '1px solid black',
    minHeight: 16
  },
  th: { 
    padding: 3, 
    fontSize: 7, 
    textAlign: 'center', 
    borderRight: '1px solid black',
    fontFamily: 'Helvetica-Bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  td: { 
    padding: 3, 
    fontSize: 7, 
    borderRight: '1px solid black',
    display: 'flex',
    justifyContent: 'center'
  },
  tdCenter: {
    textAlign: 'center',
    alignItems: 'center'
  },
  tdRight: {
    textAlign: 'right',
    alignItems: 'flex-end',
    paddingRight: 5
  },
  tdLeft: {
    textAlign: 'left',
    alignItems: 'flex-start',
    paddingLeft: 5
  },
  
  // Tax and total rows
  taxRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 28
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid black',
    fontFamily: 'Helvetica-Bold',
    minHeight: 14
  },
  
  // Amount in words with E. & O.E on same line
  amountInWords: { 
    flexDirection: 'row',
    padding: 6, 
    borderBottom: '1px solid black',
    fontSize: 7,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  amountInWordsLeft: {
    flex: 1,
    paddingRight: 10
  },
  amountInWordsLabel: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 1
  },
  
  // QR and HSN combined section
  qrHsnCombinedSection: {
    flexDirection: 'row',
    borderBottom: '1px solid black'
  },
  qrArea: {
    width: '17%',
    borderRight: '1px solid black',
    padding: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  hsnTableArea: {
    width: '83%'
  },
  qrImage: { 
    width: 50, 
    height: 50,
    marginBottom: 2
  },
  qrText: { 
    fontSize: 6, 
    textAlign: 'center' 
  },
  
  // HSN table rows
  hsnRow: {
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 14
  },
  hsnRowNoBorder: {
    flexDirection: 'row',
    minHeight: 14
  },
  hsnCell: {
    padding: 3,
    borderRight: '1px solid black',
    fontSize: 7,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  hsnCellBold: {
    fontFamily: 'Helvetica-Bold'
  },
  hsnCellLeft: {
    textAlign: 'left',
    paddingLeft: 5
  },
  
  // Tax amount in words
  taxAmountWords: {
    padding: 6,
    borderBottom: '1px solid black',
    fontSize: 7
  },
  
  // Bank section with empty space on left
  bankSection: { 
    flexDirection: 'row',
    borderBottom: '1px solid black',
    minHeight: 65
  },
  bankEmptyLeft: {
    width: '17%',
    borderRight: '1px solid black'
  },
  bankDetailsRight: {
    width: '83%',
    padding: 8
  },
  bankTitle: { 
    fontSize: 8, 
    fontFamily: 'Helvetica-Bold', 
    marginBottom: 3 
  },
  bankDetail: { 
    fontSize: 7, 
    marginBottom: 2,
    lineHeight: 1.2
  },
  
  // Declaration section
  declarationSection: { 
    flexDirection: 'row',
    minHeight: 60
  },
  declarationLeft: { 
    width: '60%', 
    padding: 8,
    borderRight: '1px solid black'
  },
  signatureRight: { 
    width: '40%', 
    padding: 8,
    display: 'flex',
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
    lineHeight: 1.3
  },
  signatureCompany: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center'
  },
  signatureLine: {
    fontSize: 7,
    textAlign: 'center',
    marginTop: 30
  },
  
  // Footer OUTSIDE box
  footer: { 
    padding: 5, 
    textAlign: 'center', 
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    marginTop: 3
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
        
        {/* Header OUTSIDE - Tax Invoice and (ORIGINAL FOR RECIPIENT) on SAME LINE */}
        <View style={styles.pageHeader}>
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
                <Text style={styles.companyName}>{company?.name || "Sunshine Industries"}</Text>
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
                <Text style={styles.detailValue}></Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Buyer's Order No.</Text>
                <Text style={styles.detailValue}>Dated</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dispatch Doc No.</Text>
                <Text style={styles.detailValue}></Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Dispatched through</Text>
                <Text style={styles.detailValue}></Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bill of Lading/LR-RR No.</Text>
                <Text style={styles.detailValue}>Motor Vehicle No.</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>dt. 2-Feb-26</Text>
                <Text style={styles.detailValue}>{invoiceDetails?.vehicleNo || ""}</Text>
              </View>
              <View style={styles.detailRowNoBorder}>
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
                <Text style={[styles.td, styles.tdLeft, { width: '33%', fontSize: 7 }]}>
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

            {/* Blank rows for spacing if items < 3 */}
            {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
              <View style={styles.tableRow} key={`blank-${i}`}>
                <Text style={[styles.td, { width: '5%' }]}></Text>
                <Text style={[styles.td, { width: '33%' }]}></Text>
                <Text style={[styles.td, { width: '10%' }]}></Text>
                <Text style={[styles.td, { width: '12%' }]}></Text>
                <Text style={[styles.td, { width: '10%' }]}></Text>
                <Text style={[styles.td, { width: '6%' }]}></Text>
                <Text style={[styles.td, { width: '12%', borderRight: 'none' }]}></Text>
              </View>
            ))}

            {/* Tax Row */}
            <View style={styles.taxRow}>
              <Text style={[styles.td, { width: '60%', paddingLeft: 8, fontSize: 8 }]}>
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
              <Text style={[styles.td, { width: '60%', fontFamily: 'Helvetica-Bold', fontSize: 8, paddingLeft: 8 }]}>
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

          {/* Amount Chargeable in Words with E. & O.E on SAME ROW */}
          <View style={styles.amountInWords}>
            <View style={styles.amountInWordsLeft}>
              <Text style={styles.amountInWordsLabel}>Amount Chargeable (in words)</Text>
              <Text style={styles.bold}>{numberToWords(grandTotal)}</Text>
            </View>
            <View style={{ alignSelf: 'flex-end', paddingBottom: 5 }}>
              <Text style={{ fontSize: 7 }}>E. & O.E</Text>
            </View>
          </View>

          {/* QR Code (LEFT) + HSN/SAC Table (RIGHT) Combined Section */}
          <View style={styles.qrHsnCombinedSection}>
            {/* QR Code on LEFT - 17% width */}
            <View style={styles.qrArea}>
              {qrCode ? (
                <Image src={qrCode} style={styles.qrImage} />
              ) : (
                <View style={{ width: 50, height: 50, border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 6 }}>QR</Text>
                </View>
              )}
              <Text style={styles.qrText}>Scan to pay</Text>
            </View>

            {/* HSN/SAC Table on RIGHT - 83% width */}
            <View style={styles.hsnTableArea}>
              {/* Header Row */}
              <View style={styles.hsnRow}>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '10%' }]}>HSN/SAC</Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '14%' }]}>Taxable{'\n'}Value</Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '8%' }]}>Rate</Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '11%' }]}>Amount</Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '11%' }]}>Tax Amount</Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '22%' }]}>Previous Balance:</Text>
                <Text style={[styles.hsnCell, styles.hsnCellLeft, { width: '24%', borderRight: 'none' }]}>
                  ₹ {previousBalance.toFixed(2)} Dr
                </Text>
              </View>

              {/* Data Row */}
              <View style={styles.hsnRow}>
                <Text style={[styles.hsnCell, { width: '10%' }]}>{items[0]?.hsnSac || ""}</Text>
                <Text style={[styles.hsnCell, { width: '14%' }]}>{subtotal.toFixed(2)}</Text>
                <Text style={[styles.hsnCell, { width: '8%' }]}>{igstRate}%</Text>
                <Text style={[styles.hsnCell, { width: '11%' }]}>{igst.toFixed(2)}</Text>
                <Text style={[styles.hsnCell, { width: '11%' }]}>{totalTax.toFixed(2)}</Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '22%' }]}>Current Balance:</Text>
                <Text style={[styles.hsnCell, styles.hsnCellLeft, { width: '24%', borderRight: 'none' }]}>
                  ₹ {currentBalance.toFixed(2)} Dr
                </Text>
              </View>

              {/* Total Row */}
              <View style={styles.hsnRowNoBorder}>
                <Text style={[styles.hsnCell, { width: '10%' }]}></Text>
                <Text style={[styles.hsnCell, styles.hsnCellBold, { width: '14%' }]}>Total</Text>
                <Text style={[styles.hsnCell, { width: '8%' }]}></Text>
                <Text style={[styles.hsnCell, { width: '11%' }]}>{subtotal.toFixed(2)}</Text>
                <Text style={[styles.hsnCell, { width: '11%' }]}>{totalTax.toFixed(2)}</Text>
                <Text style={[styles.hsnCell, { width: '22%' }]}></Text>
                <Text style={[styles.hsnCell, { width: '24%', borderRight: 'none' }]}></Text>
              </View>
            </View>
          </View>

          {/* Tax Amount in Words */}
          <View style={styles.taxAmountWords}>
            <Text><Text style={styles.bold}>Tax Amount (in words)  :  </Text>{numberToWords(totalTax)}</Text>
          </View>

          {/* Bank Details Section - Empty space on LEFT (17%), Bank details on RIGHT (83%) */}
          <View style={styles.bankSection}>
            <View style={styles.bankEmptyLeft}></View>
            <View style={styles.bankDetailsRight}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ width: '75%' }}>
                  <Text style={styles.bankTitle}>Company's Bank Details</Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>A/c Holder's Name  :  </Text>
                    {bankDetails?.accountHolderName || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>Bank Name          :  </Text>
                    {bankDetails?.bankName || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>A/c No.            :  </Text>
                    {bankDetails?.accountNo || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>Branch & IFSC Code :  </Text>
                    {bankDetails?.branchAndIFSC || ""}
                  </Text>
                  <Text style={styles.bankDetail}>
                    <Text style={styles.bold}>SWIFT Code         :  </Text>
                    {bankDetails?.swiftCode || ""}
                  </Text>
                </View>
                <View style={{ width: '25%', display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold' }}>E. & O.E</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Declaration and Signature */}
          <View style={styles.declarationSection}>
            {/* Declaration LEFT */}
            <View style={styles.declarationLeft}>
              <Text style={styles.declarationTitle}>Declaration</Text>
              <Text style={styles.declarationText}>
                We declare that this invoice shows the actual price of the goods{'\n'}
                described and that all particulars are true and correct.
              </Text>
            </View>

            {/* Signature RIGHT */}
            <View style={styles.signatureRight}>
              <Text style={styles.signatureCompany}>for {company?.name || "Sunshine Industries"}</Text>
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
