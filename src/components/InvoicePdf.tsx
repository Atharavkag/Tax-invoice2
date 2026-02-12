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
}

// Number to Words Function
const numberToWords = (num: number) => {
  if (!num) return "Zero Only";
  // Simple version - you can improve later
  return "INR " + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " Only";
};

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 9, padding: 25 },
  container: { border: '2px solid black' },
  header: { padding: 8, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'space-between' },
  headerText: { fontSize: 14, fontFamily: 'Helvetica-Bold' },
  topSection: { flexDirection: 'row', borderBottom: '1px solid black' },
  left: { width: '50%', padding: 10, borderRight: '1px solid black' },
  right: { width: '50%', padding: 8 },
  companyName: { fontSize: 12, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  text: { fontSize: 8, marginBottom: 2 },
  bold: { fontFamily: 'Helvetica-Bold' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottom: '1px solid black' },
  th: { padding: 5, fontFamily: 'Helvetica-Bold', fontSize: 8, textAlign: 'center', borderRight: '1px solid black' },
  td: { padding: 5, fontSize: 8, borderRight: '1px solid black' },
  amountInWords: { padding: 10, borderBottom: '1px solid black', flexDirection: 'row', justifyContent: 'space-between' },
  bankSection: { flexDirection: 'row', borderBottom: '1px solid black' },
  qr: { width: '35%', padding: 10, borderRight: '1px solid black', alignItems: 'center' },
  bank: { width: '65%', padding: 10 },
  declaration: { flexDirection: 'row', padding: 10 },
  leftDecl: { width: '60%' },
  rightSign: { width: '40%', textAlign: 'center' },
});

const InvoicePdf: React.FC<InvoicePdfProps> = ({ company, buyer, invoiceDetails, items, igstRate, previousBalance = 0, bankDetails, qrCode }) => {
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const igst = (subtotal * igstRate) / 100;
  const roundOff = Math.round(subtotal + igst) - (subtotal + igst);
  const grandTotal = subtotal + igst + roundOff;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Tax Invoice <Text style={{ fontSize: 8 }}>(ORIGINAL FOR RECIPIENT)</Text></Text>
          </View>

          {/* Seller + Invoice Details */}
          <View style={styles.topSection}>
            <View style={styles.left}>
              <Text style={styles.companyName}>{company?.name || "Company Name"}</Text>
              {company?.address?.map((line: string, i: number) => <Text key={i} style={styles.text}>{line}</Text>)}
              <Text style={styles.text}><Text style={styles.bold}>GSTIN/UIN: </Text>{company?.gstin}</Text>
              <Text style={styles.text}><Text style={styles.bold}>State Name: </Text>{company?.state}, Code : {company?.stateCode}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Contact: </Text>{company?.contact?.join(", ")}</Text>
              <Text style={styles.text}><Text style={styles.bold}>E-Mail: </Text>{company?.email}</Text>
            </View>

            <View style={styles.right}>
              <View style={{ flexDirection: 'row', borderBottom: '1px solid black' }}>
                <Text style={{ width: '40%', padding: 4, fontFamily: 'Helvetica-Bold' }}>Invoice No.</Text>
                <Text style={{ width: '60%', padding: 4 }}>{invoiceDetails?.invoiceNo}</Text>
              </View>
              <View style={{ flexDirection: 'row', borderBottom: '1px solid black' }}>
                <Text style={{ width: '40%', padding: 4, fontFamily: 'Helvetica-Bold' }}>Delivery Note</Text>
                <Text style={{ width: '60%', padding: 4 }}>—</Text>
              </View>
              <View style={{ flexDirection: 'row', borderBottom: '1px solid black' }}>
                <Text style={{ width: '40%', padding: 4, fontFamily: 'Helvetica-Bold' }}>Reference No. & Date.</Text>
                <Text style={{ width: '60%', padding: 4 }}>—</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: '40%', padding: 4, fontFamily: 'Helvetica-Bold' }}>Mode/Terms of Payment</Text>
                <Text style={{ width: '60%', padding: 4 }}>IMMEDIATE</Text>
              </View>
            </View>
          </View>

          {/* Buyer */}
          <View style={{ padding: 10, borderBottom: '1px solid black' }}>
            <Text style={styles.bold}>Buyer (Bill To)</Text>
            <Text style={styles.companyName}>{buyer?.name}</Text>
            {buyer?.address?.map((line: string, i: number) => <Text key={i} style={styles.text}>{line}</Text>)}
            <Text style={styles.text}><Text style={styles.bold}>GSTIN: </Text>{buyer?.gstin}</Text>
          </View>

          {/* Items Table */}
          <View>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: '6%' }]}>Sl No.</Text>
              <Text style={[styles.th, { width: '32%' }]}>Description of Goods</Text>
              <Text style={[styles.th, { width: '12%' }]}>HSN/SAC</Text>
              <Text style={[styles.th, { width: '12%' }]}>Quantity</Text>
              <Text style={[styles.th, { width: '12%' }]}>Rate</Text>
              <Text style={[styles.th, { width: '8%' }]}>per</Text>
              <Text style={[styles.th, { width: '18%' }]}>Amount</Text>
            </View>

            {items.map((item, i) => (
              <View style={{ flexDirection: 'row', borderBottom: '1px solid black' }} key={i}>
                <Text style={[styles.td, { width: '6%' }]}>{i + 1}</Text>
                <Text style={[styles.td, { width: '32%' }]}>{item.description}</Text>
                <Text style={[styles.td, { width: '12%' }]}>{item.hsnSac}</Text>
                <Text style={[styles.td, { width: '12%' }]}>{item.quantity}</Text>
                <Text style={[styles.td, { width: '12%' }]}>{item.rate}</Text>
                <Text style={[styles.td, { width: '8%' }]}>{item.unit}</Text>
                <Text style={[styles.td, { width: '18%', textAlign: 'right' }]}>{item.amount.toFixed(2)}</Text>
              </View>
            ))}

            {/* Tax Row - Match Sunshine Style */}
            <View style={{ flexDirection: 'row', borderBottom: '1px solid black' }}>
              <Text style={[styles.td, { width: '62%' }]}>IGST @ {igstRate}% ROUND OFF</Text>
              <Text style={[styles.td, { width: '20%' }]}></Text>
              <Text style={[styles.td, { width: '18%', textAlign: 'right' }]}>{igst.toFixed(2)}</Text>
            </View>
          </View>

          {/* Grand Total */}
          <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottom: '1px solid black' }}>
            <Text style={{ width: '82%', padding: 6, fontFamily: 'Helvetica-Bold' }}>Total</Text>
            <Text style={{ width: '18%', padding: 6, textAlign: 'right', fontFamily: 'Helvetica-Bold' }}>₹{grandTotal.toFixed(2)}</Text>
          </View>

          {/* Amount in Words */}
          <View style={styles.amountInWords}>
            <Text style={styles.bold}>Amount Chargeable (in words)</Text>
            <Text>{numberToWords(grandTotal)}</Text>
          </View>

          {/* Bank Details + QR */}
          <View style={styles.bankSection}>
            <View style={styles.qr}>
              {qrCode ? <Image src={qrCode} style={{ width: 70 }} /> : <Text>QR Code</Text>}
              <Text style={{ fontSize: 7, marginTop: 5 }}>Scan to pay</Text>
            </View>
            <View style={styles.bank}>
              <Text style={styles.bold}>Company's Bank Details</Text>
              <Text style={styles.text}>A/c Holder's Name: {bankDetails?.accountHolderName}</Text>
              <Text style={styles.text}>Bank Name: {bankDetails?.bankName}</Text>
              <Text style={styles.text}>A/c No.: {bankDetails?.accountNo}</Text>
              <Text style={styles.text}>Branch & IFSC Code: {bankDetails?.branchAndIFSC}</Text>
              <Text style={{ textAlign: 'right', marginTop: 10, fontSize: 9 }}>E & O E</Text>
            </View>
          </View>

          {/* Declaration + Signature */}
          <View style={styles.declaration}>
            <View style={styles.leftDecl}>
              <Text style={styles.bold}>Declaration</Text>
              <Text style={{ fontSize: 7 }}>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </Text>
            </View>
            <View style={styles.rightSign}>
              <Text style={styles.bold}>for {company?.name}</Text>
              <Text style={{ marginTop: 50 }}>Authorised Signatory</Text>
            </View>
          </View>

          <View style={{ padding: 8, borderTop: '1px solid black', textAlign: 'center', fontSize: 8 }}>
            This is a Computer Generated Invoice
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePdf;
