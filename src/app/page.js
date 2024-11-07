'use client'
import { useEffect, useState } from 'react';
import styles from "./page.module.css";



export default function Home() {

  useEffect(() => {

    console.log("USE EFFECT!");
    const getMatterPorts = async () => {
      const response = await fetch(`/api/matterports`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        console.log(error);
      });
    
      if (response) {
        const returnedData = await response?.json();
        console.log(returnedData);
      }
    };
  
    getMatterPorts();
  }, []);

  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
       our stuff here!!!
      </main>
     
    </div>
  );
}
