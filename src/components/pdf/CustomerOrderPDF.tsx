import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Customer, Item } from '@/lib/types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: '#212490',
  },
  customerInfo: {
    marginBottom: 20,
  },
  customerName: {
    fontSize: 18,
    marginBottom: 10,
    color: '#47acc9',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  tag: {
    padding: '4px 8px',
    borderRadius: 4,
    fontSize: 10,
    backgroundColor: '#f3f4f6',
  },
  itemsHeader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#212490',
  },
  table: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
    fontSize: 10,
  },
  col1: { width: '20%' },
  col2: { width: '35%' },
  col3: { width: '25%' },
  col4: { width: '20%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#9ca3af',
  },
  pageBreak: {
    marginBottom: 20,
    breakAfter: 'page',
  },
});

const STATUS_MAP = {
  waiting: 'Čaká na dovoz',
  in_stock: 'Na sklade',
  in_transit: 'V preprave',
  delivered: 'Doručené'
} as const;

interface CustomerOrderPDFProps {
  orders?: { customer: Customer; items: Item[] }[];
  customer?: Customer;
  items?: Item[];
  template?: 'default' | 'compact';
}

const OrderPage = ({ customer, items, template = 'default' }: { customer: Customer; items: Item[]; template?: 'default' | 'compact' }) => (
  <View style={styles.page}>
    <Text style={styles.header}>Zákazka</Text>
    
    <View style={styles.customerInfo}>
      <Text style={styles.customerName}>{customer.name}</Text>
      {template === 'default' && (
        <View style={styles.tags}>
          {customer.tags?.map((tag) => (
            <Text key={tag.id} style={[styles.tag, { color: tag.color }]}>
              {tag.name}
            </Text>
          ))}
        </View>
      )}
    </View>

    <Text style={styles.itemsHeader}>Položky</Text>
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.col1}>Kód</Text>
        <Text style={styles.col2}>Popis</Text>
        <Text style={styles.col3}>Stav</Text>
        <Text style={styles.col4}>Dátum</Text>
      </View>
      {items.map((item) => (
        <View key={item.id} style={styles.tableRow}>
          <Text style={styles.col1}>{item.code}</Text>
          <Text style={styles.col2}>
            {item.description || '-'}
            {template === 'default' && item.length && item.width && item.height
              ? `\nRozmery: ${item.length}×${item.width}×${item.height} cm`
              : ''}
          </Text>
          <Text style={styles.col3}>{STATUS_MAP[item.status]}</Text>
          <Text style={styles.col4}>
            {new Date(item.createdAt).toLocaleDateString('sk-SK')}
          </Text>
        </View>
      ))}
    </View>

    <Text style={styles.footer}>
      Vygenerované {new Date().toLocaleDateString('sk-SK')}
    </Text>
  </View>
);

export const CustomerOrderPDF = ({ orders, customer, items, template = 'default' }: CustomerOrderPDFProps) => {
  // Handle single order case
  if (customer && items) {
    return (
      <Document>
        <Page size="A4">
          <OrderPage customer={customer} items={items} template={template} />
        </Page>
      </Document>
    );
  }

  // Handle batch export case
  if (!orders) return null;

  return (
    <Document>
      {orders.map(({ customer, items }, index) => (
        <Page key={customer.id} size="A4">
          <OrderPage customer={customer} items={items} template={template} />
        </Page>
      ))}
    </Document>
  );
};