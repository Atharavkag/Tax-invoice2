// Assuming you're using styled-components or a similar library for your styles.

const styles = {
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px', // Example margin for spacing
    },
    headerSubtext: {
        fontSize: '12px',
        color: '#888888', // Example color for subtext
    },
};

// Usage in your component:
<div style={styles.pageHeader}>
    <h1>Tax Invoice</h1>
    <span style={styles.headerSubtext}>(ORIGINAL FOR RECIPIENT)</span>
</div>