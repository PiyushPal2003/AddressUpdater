import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import Swal from 'sweetalert2';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import './Address.css';

function Login() {
    const [show, setShow] = useState(false);
    const [updtadd, setUpdtadd] = useState("");
    const [status, setStatus] = useState();
    const [add, setAddress] = useState([]);
    const [inputs, setInputs] = useState({
        houseNo: '',
        street: '',
        city: '',
        pincode: '',
        state: ''
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const sanitizedValue = DOMPurify.sanitize(value);
        setInputs({
            ...inputs,
            [name]: sanitizedValue
        });
    };

    //performs format checking on inputs
    const validateInputs = () => {
        const newErrors = {};
        // Check if inputs are strings
        for (const key in inputs) {
            if (typeof inputs[key] !== 'string') {
                newErrors[key] = `${key} must be a string`;
            }
        }
        // Check pincode length and if it's a number
        if (inputs.pincode.length != 6 || isNaN(Number(inputs.pincode))) {
            newErrors.pincode = 'Pincode must only contain Numbers and must be 6 digit long';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    //function that sends data and saves data in database
    const storeaddress = ()=> {
        console.log("address being sent to database....")
        
        fetch("https://address-server.vercel.app/saveaddress", {
          method: "POST",
          body: JSON.stringify(inputs),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res)=>{
            if (res.status===200) {
                Swal.fire({
                    title: "Address Stored Successfully",
                    icon: "success"
                });
                getaddress();
            }
            else if (res.status===400) {
                Swal.fire({
                    title: "Address Already Exists in the Database",
                    text: "Update Address",
                    icon: "info"
                  });
                  getaddress();
            }
            else if (res.status===500) {
                Swal.fire({
                    title: "Internal Server Error",
                    text: "Please Check Console for More Information",
                    icon: "error"
                  });
                  getaddress();
            }
            return res.json()
        })
        .then((data)=>{
          console.log(data); 
        })
    }
    
//function that gets called when save address is clicked
    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateInputs()) {
            Swal.fire({
                title: "Confirm Submit Form Data?",
                text: "You Confirm Data Entered is Correct?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, I Confirm",
                cancelButtonText: "No, I want to Edit"
              }).then((result) => {
                if (result.isConfirmed) {
                    storeaddress();
                }
              });
        } else {
            console.log('Form contains errors');
        }
    };

//function that updates form
    const updateaddress = (id)=>{
        console.log("Updated Adress being sent to database....")
        
        fetch("https://address-server.vercel.app/updateaddress", {
          method: "PATCH",
          body: JSON.stringify(inputs),
          headers: {
            'Content-Type': 'application/json',
            'Address-ID': id
          },
        } 
        )
        .then((res)=>{
            if (res.status===200) {
                Swal.fire({
                    title: "Address Updated Successfully",
                    icon: "success"
                  });
                  setUpdtadd("");
                  getaddress();
            }
            else if (res.status===404) {
                Swal.fire({
                    title: "Error While Updating",
                    text: "Please Check Console for More Information",
                    icon: "error"
                  });
                  getaddress();
            }
            return res.json()
        })
        .then((data)=>{
          console.log(data); 
        })
    }

    //function that gets called on update form submission
    const handleUpdate = (event, id) => {
        event.preventDefault();
        if (validateInputs()) {
            Swal.fire({
                title: "Confirm Form Update?",
                text: "You Confirm Data Entered is Correct?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, I Confirm",
                cancelButtonText: "No, I want to Edit"
              }).then((result) => {
                if (result.isConfirmed) {
                    updateaddress(id);
                }
              });
        } else {
            console.log('Form contains errors');
        }
    };

    //function to populate the input form when update button clicked
    const update = (id, key)=>{
        setUpdtadd(key);
        const selectedAddress = add.find((address) => address._id === id);
        if(selectedAddress){
            setInputs({
                houseNo: selectedAddress.houseNo,
                street: selectedAddress.street,
                city: selectedAddress.city,
                pincode: String(selectedAddress.pincode),
                state: selectedAddress.state
            })
        }
    }


    //delete address from database
    const deleteAddress = (id)=>{
        Swal.fire({
            title: "Do You Want To Delete Address?",
            text: "Note: This Action is Irreversible",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "No, I Have Changed my Mind"
          }).then((result) => {
            if (result.isConfirmed) {
                fetch("https://address-server.vercel.app/deleteaddress", {
                    method: "DELETE",
                    headers: {
                      'Content-Type': 'application/json',
                      'Address-ID': id
                    },
                  })
                  .then((res)=>{
                    if(res.status===200){
                        Swal.fire({
                            title: "Address Deleted Successfully",
                            icon: "Success"
                          });
                          getaddress();
                    }
                  })
            }
          });
    }
    

    //get addresses from database
    const getaddress = ()=>{
        fetch("https://address-server.vercel.app/getalladdress")
        .then((res)=>res.json())
        .then((dt)=>{
            console.log(dt);
            setAddress(dt)
        })
          
    }


    useEffect(()=>{
        getaddress();
    }, [])

  return (
    <div>
      <div className='main'>
        <div className='main-head'>
            <h1>Hey there👋 Welcome to Address Updater</h1>
            <h2>Lets Begin By Adding Address <button className='add-address' onClick={()=>setShow(true)}>Add Address +</button></h2>
        </div>
        {show && (
            <>
        <form className='form' onSubmit={handleSubmit}>
            <div className='form-head'>
                <div className='form-title'>
                    Add Address
                </div>
                <div className='inp'>
                    <input type='text' className='input' name='houseNo' placeholder='Enter House No./ Building / Flat*' value={inputs.houseNo} onChange={handleInputChange} required />

                    <input type='text' className='input' name='street' placeholder='Enter Street / Nearby Area*' value={inputs.street} onChange={handleInputChange} required />

                    <input type='text' className='input' name='city' placeholder='Enter City*' value={inputs.city} onChange={handleInputChange} required />

                    {errors.pincode && <span className='error'>{errors.pincode}</span>}
                    <input type='text' className='input' name='pincode' placeholder='Enter 7 Digit PINCODE*' value={inputs.pincode} onChange={handleInputChange} required />

                    <input type='text' className='input' name='state' placeholder='Enter State*' value={inputs.state} onChange={handleInputChange} required />
                </div>
                <button type='submit' className='save'>Save Address</button>
            </div>

        </form>
        </>
        )}


        <div className='all-address'>
            <h2 className='address-h2'>All Addresses:</h2>
            <div className='address-map'>
                
                {add.map((ele,key)=>(
                    updtadd === key ? (
                        <form onSubmit={(event) => handleUpdate(event, ele._id)} key={key}>
                        <div className='form-head'>
                            <div className='form-title'>
                                Update Address
                            </div>
                            <div className='inp'>
                                <input type='text' className='input' name='houseNo' placeholder='Enter House No./ Building / Flat*' value={inputs.houseNo} onChange={handleInputChange} required />

                                <input type='text' className='input' name='street' placeholder='Enter Street / Nearby Area*' value={inputs.street} onChange={handleInputChange} required />

                                <input type='text' className='input' name='city' placeholder='Enter City*' value={inputs.city} onChange={handleInputChange} required />

                                {errors.pincode && <span className='error'>{errors.pincode}</span>}
                                <input type='text' className='input' name='pincode' placeholder='Enter 6 Digit PINCODE*' value={inputs.pincode} onChange={handleInputChange} required />

                                <input type='text' className='input' name='state' placeholder='Enter State*' value={inputs.state} onChange={handleInputChange} required />
                            </div>
                            <button type='submit' className='save'>Update Address</button>
                        </div>
                        </form>
                    ) : (
                        <>
                        <div className='addresses' key={key}>
                            <h1>Address No.{key}</h1>
                            <h1 className='full-add'>Complete Address:- {ele.houseNo}, {ele.street}, {ele.city}, {ele.pincode}, {ele.state}</h1>
                            <h1>House No./Building/Flat No:- <span className='detail'>{ele.houseNo}</span></h1>
                            <h1>Street/Nearby Area:- <span className='detail'>{ele.street}</span></h1>
                            <h1>City:- <span className='detail'>{ele.city}</span></h1>
                            <h1>Pincode:- <span className='detail'>{ele.pincode}</span></h1>
                            <h1>State:- <span className='detail'>{ele.state}</span></h1>
                        <div className='form-btn'>
                            <button className='delete-btn' onClick={()=>deleteAddress(ele._id)}><MdDelete/>Delete</button>
                            <button className='update-btn' onClick={()=>update(ele._id, key)}><FaRegEdit/>Update Address</button>
                        </div>
                        </div>
                    </>
                    )

                ))}
            </div>

        </div>

      </div>
    </div>
  )
}

export default Login
