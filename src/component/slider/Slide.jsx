import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { fetchDataFromFirebase } from '../getdata';
import { Skeleton } from 'primereact/skeleton';

const Slide = () => {
    const [products, setProducts] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const getSeverity = (product) => {
        switch (product.status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

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

    const productTemplate = (product) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3">
                    <img src={product.image} alt={product.name} className="w-6 shadow-2" />
                </div>
                <div>
                    <h4 className="mb-1">{product.name}</h4>
                    <h6 className="mt-0 mb-3">${product.price}</h6>
                    <Tag value={product.status} severity={getSeverity(product)}></Tag>
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <Button icon="pi pi-search" className="p-button p-button-rounded" />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            {!loading ?
                <Carousel value={products} numVisible={3} numScroll={3} responsiveOptions={responsiveOptions} className="custom-carousel" circular
                    autoplayInterval={3000} itemTemplate={productTemplate} /> : 
                    <div><Skeleton className="mb-2"></Skeleton>
                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                    <Skeleton height="2rem" className="mb-2"></Skeleton> 
                    <Skeleton width="10rem" height="4rem"></Skeleton></div>}
        </div>
    )
}
export default Slide