import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtext: {
    fontSize: 12,
    position: 'relative',
    marginTop: 5,
  },
});

const InvoicePdf = () => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.pageHeader}>
        <Text style={styles.headerText}>Tax Invoice</Text>
        <Text style={styles.headerSubtext}>(ORIGINAL FOR RECIPIENT)</Text>
      </View>
      {/* Other invoice content goes here */}
    </Page>
  </Document>
);

export default InvoicePdf;