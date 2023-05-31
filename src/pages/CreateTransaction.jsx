import { useContext, useState } from 'react';
import { ethers, Contract } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import Auth from '../context/Auth';
import './style.scss'
import abi from '../abi/salary.json';
import { Mailchain } from '@mailchain/sdk';
import { Button } from "@material-tailwind/react";
let arr = [];

const CreateTransaction = () => {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const secretRecoveryPhrase = process.env.REACT_APP_MAILKEY;
  const mailchain = Mailchain.fromSecretRecoveryPhrase(secretRecoveryPhrase);
  const contractAddress = process.env.REACT_APP_CONTRACT;
  const contractRead = new Contract(
    contractAddress,
    abi,
    signer
  );

  const [wallet, setWallet] = useState('');
  const [recipient, setRecipient] = useState('');
  const [FlowRate, setFlowRate] = useState('');
  const [amt, setAmt] = useState('');
  const [id, setId] = useState('');
  const [t, sett] = useState('');
  console.log("PK", process.env.REACT_APP_CONTRACT);
  async function setThings() {
    const wallet = await signer.getAddress();
    setWallet(wallet);
    if (t != "done") {
      arr = [];
      const index = await contractRead.index(wallet);
      for (let i = 0; i < index; i++) {
        const data = await contractRead.salaryMapping(wallet, i);
        arr.push({ id: i, name: data.name, receiver: data.receiver, Salary: parseInt(data.salaryAmount), Flowrate: parseInt(data.Flowrate) })
      }
      console.log("arr", arr);
      console.log("ID", arr[id].receiver);
      setRecipient(arr[id].receiver);
      setFlowRate(arr[id].Flowrate);
      setAmt(arr[id].Salary)
      sett("done");
      console.log("Rec", recipient, "Flow", FlowRate);
    }
  }
  const contract = new ethers.Contract(contractAddress, abi, signer);
  async function createNewFlow() {

    setThings();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const address = await signer.getAddress();
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });

    const superSigner = sf.createSigner({ signer: signer });

    console.log(signer);
    console.log(await superSigner.getAddress());
    const daix = await sf.loadSuperToken("fDAIx");

    try {
       if(t == 'done'){
      const createFlowOperation = daix.createFlow({
        sender: wallet,
        receiver: recipient,
        flowRate: FlowRate
        // userData?: string
      });
      console.log(createFlowOperation);
      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(superSigner);
      console.log(result);
   

      contract.storeTransaction(result.hash);
      console.log(
        `Congrats - you've just created a money stream!
          View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
          Network: Mumbai
          Super Token: DAIx
          Sender: ${wallet}
          Receiver: ${recipient},
          FlowRate: ${FlowRate},
          Amount : ${amt}
          `
      ); 
const { data, error } = await mailchain.sendMail({
        from: `shubh@mailchain.com`, // sender address
        to: [`${recipient}@ethereum.mailchain.com`], // list of recipients (blockchain or mailchain addresses)
        subject: 'party wen ser ?, Salary Super stream received 💰 💸 🤑', // subject line
        content: {
          text: `Hello ${recipient} 🔥`, // plain text body
          html: `
            <div>
           <li> Congrats - you've just created a money stream! 🚀 </li>
            <li>View Transaction on Mumbai Scan :</li>
            <li><a href="https://mumbai.polygonscan.com/tx/${result.hash}">Transaction Link</a></li>
            <li>Network: Mumbai</li>
            <li>Super Token: DAIx 💵 </li>
            <li>Sender: ${wallet}</li>
            <li>Receiver: ${recipient}</li>
            <li>FlowRate: ${FlowRate}</li>
            <li>Amount : ${amt} 💵</li>
            </div>`,
        }
      
      });
      console.log("Mail Data", data);
    
      if (error) {
        // handle error
        console.warn('Mailchain error', error);
        return;
      }
     } 
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
  }
async function createx(){
  const data = await contractRead.createMultipleStreams("0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f");
  console.log("data",data);
}

async function deletex(){
  const data = await contractRead.deleteMultipleStreams("0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f");
  console.log("data",data);
}
  async function deleteNetFlow() {
    //Rainbow kit accounts
    setThings();

    console.log("In stream delete");
    console.log("Current Account is : " + wallet + "Recipient is :" + recipient);
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });
    const superSigner = sf.createSigner({ signer: signer });

    console.log(await superSigner.getAddress());
    const daix = await sf.loadSuperToken("fDAIx");

    console.log(daix);

    try {
      const deleteFlowOperation = daix.deleteFlow({
        sender: await signer.getAddress(),
        receiver: recipient
        // userData?: string
      });

      console.log(deleteFlowOperation);
      console.log("Deleting your stream...");

      const result = await deleteFlowOperation.exec(superSigner);
      console.log(result);
      contract.storeTransaction(result.hash);
      const { data, error } = await mailchain.sendMail({
        from: `shubh@mailchain.com`, // sender address
        to: [`${recipient}@ethereum.mailchain.com`], // list of recipients (blockchain or mailchain addresses)
        subject: 'Money Stream Deleted 💀🥹💸', // subject line
        content: {
          text: `Hello ${recipient} 🔥`, // plain text body
          html: `
          <div>
         <li> A money stream was deleted 🚀 </li>
          <li>View Transaction on Mumbai Scan :</li>
          <li><a href="https://mumbai.polygonscan.com/tx/${result.hash}">Transaction Link</a></li>
          <li>Network: Mumbai</li>
          <li>Super Token: DAIx 💵 </li>
          <li>Sender: ${wallet}</li>
          <li>Receiver: ${recipient}</li>
          <li>FlowRate: ${FlowRate}</li>
          <li>Amount : ${amt} 💵</li>
          </div>`,
        }

      });
      console.log("Mail Data", data);
      if (error) {
        // handle error
        console.warn('Mailchain error', error);
        return;
      }


    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg'>
      <h1>Create Transaction</h1><br /><br />
      <form class="form">
        <div class="form__field">
          <div class="input-group">
            <label class="input-group__label">ID</label>
            <input type="text" class="input-group__input" onChange={e => setId(e.target.value)}></input>
          </div>
          <button onClick={createNewFlow} className='butto' type='button'>Start stream</button>
          <button onClick={deleteNetFlow} className='butto' type='button'>Delete stream</button>
          <button onClick={createx} className='butto' type='button'>Create X-streams💰 💸</button>
          <button onClick={deletex} className='butto' type='button'>Delete X-streams💀 💸</button>
        </div>
        <div>

        </div>
      </form>
    </div>
  );
}

export default CreateTransaction;
