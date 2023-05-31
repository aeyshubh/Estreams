import React, { useState } from 'react'
import abi from '../abi/salary.json';
import { Contract, ethers } from 'ethers';
import { useEffect } from 'react';
import { user } from '@pushprotocol/restapi';
let arr = []

const capitalize = (word) => {
    return word[0].toUpperCase() + word.slice(1)
  }

const IDS = () => {
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
       const wallet = await signer.getAddress();
       const index = await contractRead.index(wallet);
       if(t != "done"){
        arr = [];
       for(let i=0;i<index;i++){
        const data = await contractRead.salaryMapping(wallet,i);
        arr.push({id:i,name:data.name,receiver:data.receiver,Salary:parseInt(data.salaryAmount),Flowrate:parseInt(data.Flowrate)})
       }
       setUsers(arr)
       sett("done");
      }
        //console.log("Data:",arr);

        //console.log("Array",arr);
    }
     const renderHeader = () => {
        if(users.length != 0){
        console.log("Users",users);
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
                <td style={{ padding: '10px', border: '1px solid black' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{user.receiver}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{user.Salary}</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>{user.Flowrate}</td>

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

export default IDS
