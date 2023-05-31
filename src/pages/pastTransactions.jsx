import React, { useState } from 'react'
import abi from '../abi/salary.json';
import { Contract, ethers } from 'ethers';
import { useEffect } from 'react';
import { user } from '@pushprotocol/restapi';
let arr = []

const capitalize = (word) => {
    return word[0].toUpperCase() + word.slice(1)
  }

const Past = () => {
    const [users, setUsers] = useState(arr);
    const [t, sett] = useState('');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractAddress = process.env.REACT_APP_CONTRACT;
    const contractRead = new Contract(
        contractAddress,
        abi,
        signer
    );
    const submit = async () => {
        const data = await contractRead.getTransactions();
        console.log(data);
        if(t !="done"){
          arr = [];
        let l = data[0].length;
        let time = data[0];
        let tx = data[1];
        console.log("Here")
        console.log(l, time, tx);
        for (let i = 0; i < l; i++) {
            arr.push({ id: i, date: new Date(time[i] * 1000).toDateString(), tx_ID:"https://mumbai.polygonscan.com/tx/" + tx[i] })
        }
        setUsers(arr)
        console.log("arr:",arr);
        sett("done");
      }
        //console.log("Array",arr);
    }
     const renderHeader = () => {
        console.log("Users",users);
        if(users.length != 0){
            return <tr>
            {Object.keys(users[0]).map(key => <th>{capitalize(key)}</th>)}
          </tr>
        }

      }
    
    useEffect(() => {
        submit()
    }, [])

    const renderUsers = () => {
        if(users.length != 0){
        return users.map((user) => {
            console.log("ID",users.id);
            return <tr key={user.id} >
                <td style={{ padding: '10px', border: '1px solid black' }}>{user.id}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{user.date}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}><a href={user.tx_ID}>Link</a></td>
            </tr>
        })
    }
    }
    const renderTable = () => {
        return (
          <table>
            {renderHeader()}
            <tbody>
              {renderUsers()}
            </tbody>
          </table>
        )
      }

    return (
        <div style={{ margin: '5000  px' }}>
           {renderTable()}
        </div>

    );
}

export default Past
