
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { db } from "../firebase/firebase_config"
import { addDoc, collection, deleteDoc, doc, endAt, getDocs, orderBy, query, setDoc, startAt, updateDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebase_config';
import { Dropdown } from 'primereact/dropdown';
import TotalProductsPage from '../total/total';
import { Route, Routes, Link } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';

const generateUniqueId = () => {

    return Math.random().toString(36).substring(2, 15);

};
export default function ProductsDemo() {
    let emptyProduct = {
        id: null,
        name: '',
        image: '',
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0, // default status
        status: 'INSTOCK',
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [rating, setRating] = useState(0);
    const [loadingDialog, setLoadingDialog] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const onRatingChange = (event) => {
        setRating(event.value);
    };


    const toast = useRef(null);
    const dt = useRef(null);



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsRef = collection(db, 'products');
                let queryRef;

                if (searchTerm) {
                    const searchTermLower = searchTerm.toLowerCase();
                    queryRef = query(
                        productsRef,
                        orderBy('name'),
                        // startAt(searchTermLower),
                        endAt(searchTermLower + '\uf8ff')
                    );
                } else {
                    queryRef = productsRef;
                }

                const querySnapshot = await getDocs(queryRef);

                const filteredProducts = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setProducts(filteredProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                // Handle the error, show a message, etc.
            }
        };

        fetchProducts();
    }, [searchTerm]);



    const formatCurrency = (value, currency) => {
        return new Intl.NumberFormat('km-KH', { style: 'currency', currency: currency }).format(value);
    };
    const statusOptions = [
        { label: 'In Stock', value: 'INSTOCK' },
        { label: 'Low of Stock', value: 'LOWOFSTOCK' },
        { label: 'Out of Stock', value: 'OUTOFSTOCK' },
    ];

    const handleSearch = (value) => {
        setSearchTerm(value);
        // Perform the search logic here (explained in the previous response)
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };
    const saveProduct = async () => {
        setLoadingDialog(true);
        setSubmitted(true);

        if (product.name.trim()) {
            try {
                let _products = [...products];
                let _product = { ...product, rating }; // Include the rating in the product object

                // Generate a unique ID if the product doesn't have one
                if (!_product.id) {
                    _product.id = generateUniqueId();
                }

                // Upload the image if a new image is selected
                if (imageFile) {
                    const storageRef = ref(storage, `images/${_product.id}`);
                    await uploadBytes(storageRef, imageFile);
                    _product.image = await getDownloadURL(storageRef);
                } else if (!_product.id) {
                    // If it's a new product and no image is selected, set a default image URL or an empty string
                    _product.image = ''; // Set to a default URL or an empty string as needed
                }

                _product.status = product.status;

                const docRef = doc(db, 'products', _product.id);
                await setDoc(docRef, _product);

                toast.current.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: _product.id ? 'Product Updated' : 'Product Created',
                    life: 3000,
                });

                if (!_product.id) {
                    // If it's a new product, add it to the local state
                    _products.push(_product);
                }

                setProducts(_products);
                setProductDialog(false);
                setProduct(emptyProduct);
                setImageFile(null); // Reset the image file after saving
                setRating(0); // Reset the rating after saving
            } catch (error) {
                console.error('Error adding/updating product to Firebase:', error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save product',
                    life: 3000,
                });
            }
        }
        fetchData();
        setLoadingDialog(false);
    };




    const editProduct = (product) => {
        setProduct({ ...product });
        setRating(product.rating); // Set the initial rating

        // Set the initial value of the image property based on the existing product
        setProduct((prevProduct) => ({
            ...prevProduct,
            image: product.image || '', // Set to the existing image URL or an empty string
        }));

        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        try {
            const docRef = doc(db, 'products', product.id);
            await deleteDoc(docRef);

            let _products = products.filter((val) => val.id !== product.id);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        } catch (error) {
            console.error('Error deleting product from Firebase:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
        }
    };
    const onFileChange = (e) => {
        const file = e.files[0];
        if (file) {
            setImageFile(file);

            // Update the product state with the new image
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: URL.createObjectURL(file),
            }));
        }
    };



    const exportCSV = () => {
        dt.current.exportCSV();
    };



    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));

        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };


    const [loading, setLoading] = useState(true);

    const [noData, setNoData] = useState(false);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'products'));
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProducts(data);
            setNoData(data.length === 0);
        } catch (error) {
            console.error('Error fetching products from Firebase:', error);
            setNoData(true);
        } finally {
            setLoading(false);
        }
    };

    const renderDataTable = () => {
        if (loading) {
            return <div className="card">
                <div className="border-round border-1 surface-border p-4 surface-card">
                    <div className="flex mb-3">
                        <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                        <div>
                            <Skeleton width="10rem" className="mb-2"></Skeleton>
                            <Skeleton width="5rem" className="mb-2"></Skeleton>
                            <Skeleton height=".5rem"></Skeleton>
                        </div>
                    </div>
                    <Skeleton width="100%" height="150px"></Skeleton>
                    <div className="flex justify-content-between mt-3">
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                        <Skeleton width="4rem" height="2rem"></Skeleton>
                    </div>
                </div>
            </div>
        }

        if (noData) {
            return <div>No data found</div>;
        }

        return (
            <DataTable
                ref={dt}
                value={products}
                selection={selectedProducts}
                onSelectionChange={(e) => setSelectedProducts(e.value)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                globalFilter={globalFilter}
                header={header}
            >
                <Column selectionMode="multiple" exportable={false}></Column>
                <Column field="id" header="Code" sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="name" header="Name" sortable style={{ minWidth: '16rem' }}></Column>
                <Column field="image" header="Image" body={imageBodyTemplate}></Column>
                <Column field="price" header="Price" body={priceBodyTemplate} sortable style={{ minWidth: '8rem' }}></Column>
                <Column field="category" header="Category" sortable style={{ minWidth: '10rem' }}></Column>
                <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                <Column field="status" header="Status" body={statusBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>

            </DataTable>
        );
    };


    const onCategoryChange = (e) => {
        let _product = { ...product };

        _product['category'] = e.value;
        setProduct(_product);
    };
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };

        if (name === 'status') {
            _product[`${name}`] = val;
        } else {
            _product[`${name}`] = val;
        }

        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { ...product };

        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="New"
                    icon="pi pi-plus"
                    severity="success"
                    onClick={openNew}
                    disabled={loadingSave}
                />
                <Button
                    label="Reload"
                    icon="pi pi-refresh"
                    className="p-button-success"
                    onClick={fetchData}
                    disabled={loadingSave}
                />
            </div>
        );
    };
    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return <img src={rowData.image} alt={rowData.image} className="shadow-2 border-round" style={{ width: '64px' }} />;
    };

    const priceBodyTemplate = (rowData) => {
        return formatCurrency(rowData.price, 'KHR');
    };



    const ratingBodyTemplate = (rowData) => {
        return <Rating value={rowData.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <span className={`product-badge status-${rowData.status.toLowerCase()}`}>
                {rowData.status === 'INSTOCK' ? 'In Stock' : rowData.status === 'LOWOFSTOCK' ? 'Low of Stock' : 'Out of Stock'}
            </span>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };


    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => handleSearch(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const productDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                outlined
                onClick={hideDialog}
                disabled={loadingDialog}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                onClick={saveProduct}
                disabled={loadingDialog}
            />
        </React.Fragment>
    );


    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}>
                    <Button label="Reload" icon="pi pi-refresh" className="p-button-success" onClick={fetchData} />
                </Toolbar>
                {renderDataTable()}
            </div>
            {!loadingDialog ? <Dialog
                visible={productDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Product Details"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}>
                {product.image && <img src={product.image} alt={product.image} style={{ "height": "310px", "width": "310px", objectFit: "contain" }} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="rating" className="font-bold">
                        Rating
                    </label>
                    <Rating value={rating} onChange={onRatingChange} />
                </div>
                <div className="field">
                    <label htmlFor="image" className="font-bold">
                        Image
                    </label>
                    <FileUpload
                        chooseLabel="Choose"
                        uploadLabel="Upload"
                        cancelLabel="Cancel"
                        mode="basic"
                        name="demo[]"
                        maxFileSize={1000000} // 1MB
                        onSelect={onFileChange}
                        auto // Add the auto property
                    /> <p style={{ "color": "red" }}>Image must small then 5mb and size "16x9" or "5x5"</p>

                </div>
                <div className="field">
                    <label htmlFor="status" className="font-bold">
                        Status
                    </label>
                    <Dropdown
                        id="status"
                        value={product.status}
                        options={statusOptions}
                        onChange={(e) => onInputChange({ target: { value: e.value } }, 'status')}
                        placeholder="Select a status"
                    />
                </div>
                <div className="field">
                    <br />
                    <label htmlFor="name" className="font-bold">
                        Name
                    </label>

                    <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                    {submitted && !product.name && <small className="p-error">Name is required.</small>}
                </div>
                <div className="field">
                    <label htmlFor="description" className="font-bold">
                        Description
                    </label>
                    <InputTextarea id="description" value={product.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
                </div>

                <div className="field">
                    <label className="mb-3 font-bold">Category</label>
                    <div className="formgrid grid">
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={product.category === 'Accessories'} />
                            <label htmlFor="category1">Accessories</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={product.category === 'Clothing'} />
                            <label htmlFor="category2">Clothing</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={product.category === 'Electronics'} />
                            <label htmlFor="category3">Electronics</label>
                        </div>
                        <div className="field-radiobutton col-6">
                            <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={product.category === 'Fitness'} />
                            <label htmlFor="category4">Fitness</label>
                        </div>
                    </div>
                </div>

                <div className="formgrid grid">
                    <div className="field col">
                        <label htmlFor="price" className="font-bold">
                            Price
                        </label>
                        <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="KHR" locale="km-KH" />
                    </div>
                    <div className="field col">
                        <label htmlFor="quantity" className="font-bold">
                            Quantity
                        </label>
                        <InputNumber id="quantity" value={product.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} />
                    </div>
                </div>

            </Dialog> : (<Dialog visible={productDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Product Details"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}><div className="card">
                    <div className="border-round border-1 surface-border p-4 surface-card">
                        <div className="flex mb-3">
                            <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                            <div>
                                <Skeleton width="10rem" className="mb-2"></Skeleton>
                                <Skeleton width="5rem" className="mb-2"></Skeleton>
                                <Skeleton height=".5rem"></Skeleton>
                            </div>
                        </div>
                        <Skeleton width="100%" height="150px"></Skeleton>
                        <div className="flex justify-content-between mt-3">
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                            <Skeleton width="4rem" height="2rem"></Skeleton>
                        </div>
                    </div>
                </div></Dialog>)}


            <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>



        </div>
    );
}
