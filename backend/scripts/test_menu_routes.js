// Native fetch is used (Node 18+)

const BASE_URL = 'http://localhost:5000/api/menu';

async function runTests() {
    console.log('--- Starting Menu Route Tests ---');

    let newItemId;

    // 1. Create a new item
    console.log('\n1. Testing Create Item...');
    try {
        const createRes = await fetch(`${BASE_URL}/createitem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test Burger",
                description: "A delicious test burger",
                price: 15,
                category: "Fast Food",
                availability: true,
                image: "http://example.com/burger.png"
            })
        });
        const createData = await createRes.json();
        console.log('Create Response:', createData.success ? 'SUCCESS' : 'FAILED', createData.success ? '' : createData);

        if (createData.success) {
            newItemId = createData.data._id;
            console.log('Created Item ID:', newItemId);
        } else {
            console.error('Stopping tests due to creation failure.');
            return;
        }
    } catch (e) {
        console.error('Create Request Failed:', e.message);
        return;
    }

    // 2. Get All Items
    console.log('\n2. Testing Get All Items...');
    try {
        const getAllRes = await fetch(`${BASE_URL}/getallitems`);
        const getAllData = await getAllRes.json();
        console.log('Get All Response:', getAllData.success ? 'SUCCESS' : 'FAILED');
        if (getAllData.success) {
            const found = getAllData.data.find(item => item._id === newItemId);
            console.log('New item found in list:', !!found);
        }
    } catch (e) {
        console.error('Get All Request Failed:', e.message);
    }

    // 3. Get Single Item
    console.log('\n3. Testing Get Single Item...');
    try {
        const getSingleRes = await fetch(`${BASE_URL}/getSingleitem/${newItemId}`);
        const getSingleData = await getSingleRes.json();
        console.log('Get Single Response:', getSingleData.success ? 'SUCCESS' : 'FAILED');
        if (getSingleData.success) {
            console.log('Fetched Item Name:', getSingleData.data.name);
        }
    } catch (e) {
        console.error('Get Single Request Failed:', e.message);
    }

    // 4. Update Item
    console.log('\n4. Testing Update Item...');
    try {
        const updateRes = await fetch(`${BASE_URL}/updateitem/${newItemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                price: 20,
                description: "Updated description"
            })
        });
        const updateData = await updateRes.json();
        console.log('Update Response:', updateData.success ? 'SUCCESS' : 'FAILED');
        if (updateData.success && updateData.data.price === 20) {
            console.log('Price updated correctly.');
        }
    } catch (e) {
        console.error('Update Request Failed:', e.message);
    }

    // 5. Delete Item
    console.log('\n5. Testing Delete Item...');
    try {
        const deleteRes = await fetch(`${BASE_URL}/deleteitem/${newItemId}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteRes.json();
        console.log('Delete Response:', deleteData.success ? 'SUCCESS' : 'FAILED');
    } catch (e) {
        console.error('Delete Request Failed:', e.message);
    }

    // 6. Verify Deletion
    console.log('\n6. Verifying Deletion (Get Single Item again)...');
    try {
        const verifyRes = await fetch(`${BASE_URL}/getSingleitem/${newItemId}`);
        const verifyData = await verifyRes.json();
        // We expect a 404 or success:false
        if (!verifyData.success || verifyRes.status === 404) {
            console.log('Verification Success: Item not found as expected.');
        } else {
            console.log('Verification Failed: Item still exists.');
        }
    } catch (e) {
        console.error('Verify Request Failed:', e);
    }
}

runTests();
