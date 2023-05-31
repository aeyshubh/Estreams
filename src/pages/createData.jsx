import { useContext, useState } from 'react';
import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import Auth from '../context/Auth';
import './style.scss'
import { P } from 'core-js/modules/_export';
import abi from '../abi/salary.json';
 function CreateData() {
    const { address } = useContext(Auth)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const [recipient, setRecipient] = useState('');
    const [flow, setFlow] = useState('');
    const [name, setName] = useState('');
    const [amt, setAmt] = useState('');
    const [id, setId] = useState('');
    const contractAddress = process.env.REACT_APP_CONTRACT;
    const contract = new ethers.Contract(contractAddress, abi, signer);
console.log("In Salary set");
    async function setSalary() {
        const tx = await contract.setSalaryInfo(recipient, name, flow, amt,0);//add 0 in the updates contract
        console.log("Tx Hash", tx.hash);
    }

    function updateSalary() {
        const tx = contract.setSalaryInfo(recipient, name, flow, amt, id);
        console.log("Tx Hash", tx.hash);

    }
    return (
        <div className='bg'>
            <h1>Add Person</h1><br /><br />
            <form class="form">
                <div class="form__field">
                    <div class="input-group">
                        <label class="input-group__label">Name</label>
                        <input type="text" class="input-group__input" onChange={e => setName(e.target.value)}></input>
                    </div>
                    <div class="input-group">
                        <label class="input-group__label">Receiver wallet address</label>
                        <input type="text" class="input-group__input" onChange={e => setRecipient(e.target.value)}></input>
                    </div>
                    <div class="input-group">
                        <label class="input-group__label">Flowrate</label>
                        <input type="text" class="input-group__input" onChange={e => setFlow(e.target.value)}></input>
                    </div>
                    <div class="input-group">
                        <label class="input-group__label">Amount</label>
                        <input type="text" class="input-group__input" onChange={e => setAmt(e.target.value)}></input>
                    </div>
                    <div class="input-group">
                        <label class="input-group__label">ID</label>
                        <input type="text" class="input-group__input" placeholder='If you want to update FLowrate' onChange={e => setId(e.target.value)}></input>
                    </div>
                    <button onClick={setSalary} className='butto' type='button'>Set Salary</button>
                    <button onClick={updateSalary} className='butto' type='button'>Update Salary</button>
                </div>
            </form>
        </div>
    );
}

export default CreateData;
