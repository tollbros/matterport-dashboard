'use client'
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import Link from 'next/link';



export default function Home() {

  const [matterports, setMatterports] = useState([]);
  const [liveMatterports, setLiveMatterports] = useState([]);

  const loadCSV = async () => {
    //load .csv file from /data/matterport.csv
    const response = await fetch('/data/matterport.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    const parsedMatterports = parseCSV(csv);
    setMatterports(parsedMatterports);
  }

  const parseCSV = (csv) => {
    const lines = csv.split('\n');
    const result = [];
    //const headers = lines[0].split(',');
    for (let i = 6; i < lines.length; i++) {
      //const obj = {};
      const currentline = lines[i].split(',');
      if (currentline.length > 5) {
        result.push(currentline);
      }
      /* for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      } */
      //result.push(obj);
    }
    return result
  }

  const removeQuotes = (str) => {
    return str.replace(/['"]+/g, '');
  }

  const isLive = (mID) => {
    for (let i = 0; i < liveMatterports.length; i++) {
      if (liveMatterports[i]['Matterport Name'] === mID) {
        return true;
      }
    }
    return false;
  }

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
        setLiveMatterports(returnedData);
        console.log(returnedData);
      }
    };

  
    getMatterPorts();

  }, []);

  useEffect(() => {
    console.log("MATTERPORTS: ", liveMatterports);
    loadCSV();
  }, [liveMatterports]);

  
  return (
    <div className={styles.page}>
      <main className={styles.main}>

       <section className={styles.mlist}>

          <a href="#ununsed">Jump to Unused Matterports</a>

          <h2> Matterport vs Web Database </h2>
          <ol>
            {matterports.map((matterport, index) => {
              const mLink = removeQuotes(matterport[1]);
              const mLinkID = mLink.split('/')[mLink.split('/').length - 1];

              const live = isLive(mLinkID);
              
              return (
                <li key={index} className={!live ? styles.inActive : ""}>
                  <p>{live ? "FOUND" : "NOT FOUND"} | <span><Link target="_blank" href={mLink}>{mLinkID}</Link></span>: {removeQuotes(matterport[0])} {removeQuotes(matterport[2])}</p>
                </li>
              )
            })}
          </ol>
       </section>

       <section className={styles.mlist}>
          <h2 id="ununsed"> Unused Matterports </h2>
          <ol>
            {matterports.map((matterport, index) => {
              const mLink = removeQuotes(matterport[1]);
              const mLinkID = mLink.split('/')[mLink.split('/').length - 1];

              const live = isLive(mLinkID);
              
              if (!live){
                return (
                  <li key={index} className={!live ? styles.inActive : ""}>
                    <p>{live ? "FOUND" : "NOT FOUND"} | <span><Link target="_blank" href={mLink}>{mLinkID}</Link></span>: {removeQuotes(matterport[0])} {removeQuotes(matterport[2])}</p>
                  </li>
                )
              }
            })}
          </ol>
       </section>
      </main>
     
    </div>
  );
}
