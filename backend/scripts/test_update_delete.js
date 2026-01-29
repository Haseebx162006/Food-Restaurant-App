// Native fetch (Node 18+)
const BASE_URL = 'http://localhost:5000/api/menu';

async function runTests() {
    console.log('--- Starting Update/Delete Tests ---');
    let itemId;

    // 1. Create
    try {
        const res = await fetch(`${BASE_URL}/createitem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Temp Item",
                description: "To be deleted",
                price: 10,
                category: "Test",
                availability: true,
                image: "none"
            })
        });
        const data = await res.json();
        if (data.success) {
            itemId = data.data._id;
            console.log('Created Item:', itemId);
        } else {
            console.error('Create Failed:', data);
            return;
        }
    } catch (e) {
        console.error('Create Error:', e);
        return;
    }

    // 2. Update
    try {
        console.log('Testing Update...');
        const res = await fetch(`${BASE_URL}/updateitem/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: 99 })
        });
        const data = await res.json();
        console.log('Update Result:', data.success ? 'SUCCESS' : 'FAILED');
        if (data.data && data.data.price === 99) console.log('Price verified: 99');
    } catch (e) {
        console.error('Update Error:', e);
    }

    // 3. Delete
    try {
        console.log('Testing Delete...');
        const res = await fetch(`${BASE_URL}/deleteitem/${itemId}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        console.log('Delete Result:', data.success ? 'SUCCESS' : 'FAILED');
    } catch (e) {
        console.error('Delete Error:', e);
    }

    // 4. Verify Delete
    try {
        console.log('Verifying Deletion...');
        const res = await fetch(`${BASE_URL}/getSingleitem/${itemId}`);
        const data = await res.json();
        if (!data.success || res.status === 404) {
            console.log('Verification Success: Item gone.');
        } else {
            console.log('Verification Failed: Item still exists.');
        }
    } catch (e) {
        console.error('Verify Error:', e);
    }
}

runTests();
