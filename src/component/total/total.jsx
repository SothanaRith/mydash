import { useEffect, useState } from 'react';
import { fetchDataFromFirebase } from '../getdata';
import { Card } from 'primereact/card';
import '../total/totals.scss';

const TotalProductsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0); // Initial count
    const [count1, setCount1] = useState(0); // Initial count
    const [count2, setCount2] = useState(0); // Initial count
 // Set your desired maximum number
  
    useEffect(() => {
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
  
      fetchData();
    }, []);
  

  
    // Function to calculate the total based on the data
    const calculateTotal = () => {
      return data.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    const calculateQuantitity = () => {
      return data.reduce((total, item) => total + item.quantity, 0);
    };
    const calculateProduct = () => {
      return data.length;
    };
    const maxNumber1 = calculateTotal(); // Set your desired maximum number
    const maxNumber2 = calculateQuantitity(); // Set your desired maximum number
    const maxNumber3 = calculateProduct();
    useEffect(() => {
        // Start counting animation when the component is mounted
        const countInterval = setInterval(() => {
          setCount((prevCount) => (prevCount < maxNumber1 ? prevCount + 5000  : maxNumber1));
        }, 20); // Adjust the interval for smoother animation
    
        // Clear the interval when the component is unmounted or when count reaches maxNumber
        return () => clearInterval(countInterval);
      }, [maxNumber1]);

      useEffect(() => {
        // Start counting animation when the component is mounted
        const countInterval1 = setInterval(() => {
          setCount1((prevCount) => (prevCount < maxNumber2 ? prevCount + 1 : maxNumber2));
        }, 20); // Adjust the interval for smoother animation
    
        // Clear the interval when the component is unmounted or when count reaches maxNumber
        return () => clearInterval(countInterval1);
      }, [maxNumber2]);
      useEffect(() => {
        // Start counting animation when the component is mounted
        const countInterval2 = setInterval(() => {
          setCount2((prevCount) => (prevCount < maxNumber3 ? prevCount + 1 : maxNumber3));
        }, 20); // Adjust the interval for smoother animation
    
        // Clear the interval when the component is unmounted or when count reaches maxNumber
        return () => clearInterval(countInterval2);
      }, [maxNumber3]);
  
    return (
      <div>
        {loading ? (
          // Loading state
          <div>Loading...</div>
        ) : (
          // Render the data, total, and counting animation
          <div className="total">
            <div className="cards">
              <Card title="Product price">
                <p className="m-0">
                  <strong>Total Product price:</strong> <h1>{count}KHR</h1>
                </p>
              </Card>
            </div>
            <div className="cards">
              <Card title="Product Quantity">
                <p className="m-0">
                  <strong>Total Product Quantity:</strong> <h1>{count1}</h1>
                </p>
              </Card>
            </div>
            <div className="cards">
              <Card title="Product">
                <p className="m-0">
                  <strong>Total Product :</strong> <h1>{count2}</h1>
                </p>
              </Card>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default TotalProductsPage;