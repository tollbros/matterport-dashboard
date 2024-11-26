'use client'
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import Link from 'next/link';
import Head from 'next/head';



export default function Home() {

  const [matterports, setMatterports] = useState([]);
  const [liveMatterports, setLiveMatterports] = useState([]);
  const [gettingData, setGettingData] = useState(true);


  const [green, setGreen] = useState(true);
  const [red, setRed] = useState(true);
  const [yellow, setYellow] = useState(true);
  const [white, setWhite] = useState(true);

  const handleGreen = (event) => {
    setGreen(event.target.checked);
  };

  const handleRed = (event) => {
    setRed(event.target.checked);
  };

  const handleYellow = (event) => {
    setYellow(event.target.checked);
  };

  const handleWhite = (event) => {
    setWhite(event.target.checked);
  };


  const isLive = (mID) => {
    for (let i = 0; i < liveMatterports.length; i++) {
      if (liveMatterports[i]['Matterport Name'] === mID) {
        return true;
      }
    }
    return false;
  }

 
  useEffect(() => {
    const fetchCsv = async () => {
      try {
        const response = await fetch('/matterport-dashboard/data/matterport.csv');
        const csvText = await response.text();
        const parsedData = parseCsv(csvText);

        parsedData.sort((a, b) => {
          return new Date(a.Created_Date) - new Date(b.Created_Date);
        });

        setMatterports(parsedData);
      } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
      }
    };

    fetchCsv();
  }, []);


  const parseCsv = (csvText) => {
    const lines = csvText.split('\n'); // Split by line
    const headers = lines[5].split(','); // Assume 6th line is header
    const rows = lines.slice(6); // Exclude header row and above (meta data from Matterport)

    return rows
      .filter((row) => row.trim() !== '')  // Remove empty rows
      .map((row) => {
        const values = row.match(/"[^"]*"|[^,]+/g).map(item => item?.replace(/^"|"$/g, '')); // Split by comma, but ignore commas inside quotes
        return headers.reduce((acc, header, index) => {
          acc[header.trim().replace(/(^"|"$)/g, '').replace(/\s+/g, '_')] = values[index]?.trim() || '';  // Replace spaces with underscores and remove quotes in header
          return acc;
        }, {});
      });
  };


  useEffect(() => {
    const getMatterPorts = async () => {
      const response = await fetch(`/matterport-dashboard/api/matterports`, {
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
        setGettingData(false);
      }
    };
    
    if (matterports.length > 0) {
      getMatterPorts();
    }
  }, [matterports]);

  
  return (
    <div className={styles.page}>
      <main className={styles.main}>

        

       <section className={styles.mlist}>

          <h2> Matterport vs Web Database
            {gettingData && <span>Fetching Data from Web Database</span>}
            {!gettingData && <span className={styles.got}>Data Fetched from Web Database!</span>}
          </h2>

          <aside>
            <fieldset className={styles.inputs}>
              <input type="checkbox" id="white" name="Online and Live" checked={white} onChange={handleWhite} />
              <label for="white">Online and Live</label>
            </fieldset>
            <fieldset className={styles.inputs}>
              <input type="checkbox" id="green" name="Offline and Archived" checked={green} onChange={handleGreen} />
              <label for="green" className={styles.inputGreen}>Offline and Archived</label>
            </fieldset>
            <fieldset className={styles.inputs}>
              <input type="checkbox" id="yellow" name="Online and Archived" checked={yellow} onChange={handleYellow} />
              <label for="yellow" className={styles.inputYellow}>Online and Archived</label>
            </fieldset>
            <fieldset className={styles.inputs}>
              <input type="checkbox" id="red" name="Offline and Not Archived" checked={red} onChange={handleRed} />
              <label for="red"className={styles.inputRed}>Offline and Not Archived</label>
            </fieldset>
          </aside>
          
          {matterports.length > 0 && //liveMatterports.length > 0 && 
          <ol>
             <li className={`${styles.header}`}>
                <p><span>WEB DB STATUS</span><span>MP ID</span> <span>MP FOLDER</span> <span>MP NAME</span> <span>CREATE DATE</span></p>
              </li>
              {matterports.map((matterport, index) => {

                  const mLink = matterport.Space_Details_URL;
                  const mLinkID = mLink.split('/')[mLink.split('/').length - 1];

                  const live = isLive(mLinkID);
                  const isArchived = matterport.Parent_folder_name.toLowerCase().includes("archived");
                
                  const isGreen = !live && isArchived;
                  const isRed = !live && !isArchived;
                  const isYellow = live && isArchived;
                  const isWhite = live && !isArchived;

                  let shown = false;
                  if (green && isGreen || red && isRed || yellow && isYellow || white && isWhite) {
                    shown = true;
                  }

                    return (
                      <li key={`mm-${index}`} className={`${!shown ? styles.hidden : ""} ${!live ? styles.inActive : ""}  ${isArchived ? styles.isArchived : ""} ${(isArchived && !live) ? styles.archivedAndNotLive : ""}`}>
                        <p><span>{live ? "online" : "offline"}</span><span><Link target="_blank" href={mLink}>{mLinkID}</Link></span> <span>{matterport.Parent_folder_name}</span> <span>{matterport.Space_name}</span> <span>{matterport.Created_Date}</span></p>
                      </li>
                    )
                  
              })}
          </ol>
          }
       </section>

      </main>
     
    </div>
  );
}
