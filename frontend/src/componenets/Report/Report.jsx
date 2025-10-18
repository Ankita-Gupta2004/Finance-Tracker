import React from 'react'
import AssetsReport from './AssetsReport'
import SipAllocatorReport from './SipAllocatorReport'
import Navbar from '../Navbar'
import Footer from '../Footer'

const Report = () => {
  return (
    <>
    <Navbar></Navbar>
    
    <AssetsReport></AssetsReport>
    <SipAllocatorReport></SipAllocatorReport>
    <Footer></Footer>
    </>
  )
}

export default Report