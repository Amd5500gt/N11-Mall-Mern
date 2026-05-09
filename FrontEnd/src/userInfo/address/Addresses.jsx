import React, { useEffect, useState } from 'react'
import { useSearch } from '../../context/SearchContext'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import AddressForm from './AddressForm'

const Addresses = () => {
    const { userData, token } = useSearch()
    const [userAddress, setUserAddress] = useState({
        name: "",
        email: "",
        picture: "",
        address: "",
        cart: [],
})
    useEffect(() => {
        try {
            token ? setUserAddress(userData.Address) : (<Link to={<AddressForm />}>Add Address</Link>)
        }
        catch (err) {

        }
    })
return (
    <div>
        <div className='address-model-box'>
            <div className='left-side'>
                <span>{userAddress.name}</span>
                <span>{userAddress.number}</span>
                <span>{userAddress.pincode}</span>
            </div>
            <div className='right-side'>
                <span>{userAddress.addressLine1}</span>
                <span>{userAddress.city}</span>
                <span>{userAddress.state}</span>
            </div>
        </div>
    </div>
)
}

export default Addresses