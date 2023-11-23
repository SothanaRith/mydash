import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { fetchDataFromFirebase } from '../getdata';
import "../dataview/dataview.scss"
import { Dialog } from 'primereact/dialog';
import { Skeleton } from 'primereact/skeleton';

const Dataview = () => {
    const [products, setProducts] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const fetchedData = await fetchDataFromFirebase();
            setData(fetchedData);
        } catch (error) {
            // Handle the error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchDataFromFirebase().then((fetchedData) => {
            setProducts(fetchedData.slice(0, 12));
            setLoading(false);
        }).catch((error) => {
            // Handle the error
            setLoading(false);
        });
    }, []);

    const getSeverity = (product) => {
        switch (product.status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWOFSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const listItem = (product) => {
        return (

            <div className="col-12">

                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={product.image} alt={product.name} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.name}</div>
                            <Rating value={product.rating} readOnly cancel={false}></Rating>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.category}</span>
                                </span>
                                <Tag value={product.status} severity={getSeverity(product)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">៛ {product.price}</span>
                            <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.status === 'Out of Stock'}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-tag"></i>
                            <span className="font-semibold">{product.category}</span>
                        </div>
                        <Tag value={product.status} severity={getSeverity(product)}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <img className="w-9 shadow-2 border-round" src={product.image} alt={product.name} />
                        <div className="text-2xl font-bold">{product.name}</div>
                        <Rating value={product.rating} readOnly cancel={false}></Rating>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">៛ ​{product.price}</span>
                        <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={product.status === 'OUTOFSTOCK'}></Button>
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product);
        else if (layout === 'grid') return gridItem(product);
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };
    return (
        <div className="dataview">
            {loading ? (
                // Loading state

                <div className="card">
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
            ) : (
                <div className="card">
                    <DataView value={products} itemTemplate={itemTemplate} layout={layout} header={header()} />
                </div>)}

        </div>
    )
}
export default Dataview