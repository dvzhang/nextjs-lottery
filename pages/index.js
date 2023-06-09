import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

// import ManualHeader from "../components/ManualHeader"
import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Lottery App</title>
        <meta name="description" content="Hardhat Lottery App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <ManualHeader></ManualHeader> */}
      <Header />
      <LotteryEntrance />
      
    </>
  )
}
