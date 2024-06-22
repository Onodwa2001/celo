import { useEffect, useState } from "react";
import PrimaryButton from "@/components/Button";
import { useWeb3 } from "@/context/useWeb3";
import { formatUnits, parseUnits } from "viem";
import * as React from "react";
import TextField from "@mui/material/TextField";
import { Card, Chip, Divider, FormControl, InputAdornment, InputLabel, OutlinedInput, Paper, Stack, Typography } from "@mui/material";

export default function Home() {
  const {
    address,
    getUserAddress,
    sendCUSD,
    getBalance,
    checkIfTransactionSucceeded,
    estimateGas,
    estimateGasPrice,
  } = useWeb3();
  const [signingLoading, setSigningLoading] = useState(false);
  const [tx, setTx] = useState<any>(undefined);
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [transactionStatus, setTransactionStatus] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [gasPrice, setGasPrice] = useState<string | null>(null);

  useEffect(() => {
    getUserAddress().then(async () => {
      if (address) {
        const userBalance = await getBalance(address);
        setBalance(userBalance);
      }
    });
  }, [address]);

  useEffect(() => {
    if (recipient && amount && address) {
      const getEstimates = async () => {
        try {
          // Make sure to parse 'amount' to the correct unit before sending it.
          const value = parseUnits(amount, 18); // Assuming 'amount' is intended to be in ether units.

          const estimatedGas = await estimateGas({
            from: address,
            to: recipient,
            value: value.toString(), // Ensure value is a string if your API expects it.
          });
          setGasEstimate(estimatedGas.toString());

          const priceWei = await estimateGasPrice();
          const price = BigInt(priceWei); // Convert hex string to BigInt
          setGasPrice(formatUnits(price, 18) + " Gwei"); // Now converting correctly.
        } catch (error) {
          console.error("Error getting estimates:", error);
        }
      };

      getEstimates();
    }
  }, [recipient, amount, address]); // Added 'address' as a dependency as well.

  useEffect(() => {
    const checkStatus = async () => {
      if (tx) {
        const status = await checkIfTransactionSucceeded(tx.transactionHash);
        setTransactionStatus(status ? "Successful😃" : "Failed😒");
      }
    };
    checkStatus();
  }, [tx]);

  const sendingCUSD = async () => {
    if (recipient && amount) {
      const amountInCUSD = parseFloat(amount);
      const balanceInCUSD = parseFloat(balance);
      if (amountInCUSD > balanceInCUSD) {
        setErrorMessage("Insufficient balance to complete the transaction.");
        return;
      }
      setSigningLoading(true);
      setErrorMessage(null);
      try {
        const tx = await sendCUSD(recipient, amount);
        setTx(tx);
        const userBalance = await getBalance(address!);
        setBalance(userBalance);
      } catch (error) {
        console.log(error);
      } finally {
        setSigningLoading(false);
      }
    }
  };

  return (
    <div className='flex flex-col items-center p-2 rounded-xl bg-grey-100'>
      <Card className='w-full max-w-md bg-white rounded-3xl p-6 shadow-lg'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold mb-2'>ORA-Core Pay</h1>

          {address && (
            <>
              <Typography>Connected Address:</Typography>
              <div className='font-bold text-sm break-all'>{address}</div>
              <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography>Balance:</Typography>
                <Typography>{balance} cUSD</Typography>
              </Stack>
              <div className='font-bold text-lg m-2'></div>
            </>
          )}
        </div>

        {address && (
          <>
            <div className='flex flex-col items-center'>
              <div className='mb-3'>
                <TextField
                  id='outlined-basic'
                  label='Recipient Adress'
                  variant='outlined'
                  value={recipient}
                  fullWidth
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <TextField
                  id='outlined-basic'
                  label='Amount'
                  variant='outlined'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />

              </div>
              {errorMessage && (
                <div className='text-red-500 text-sm mb-3'>{errorMessage}</div>
              )}
              <PrimaryButton
                loading={signingLoading}
                onClick={sendingCUSD}
                title='Send cUSD'
                widthFull
              />
            </div>
            <div className='w-full px-3 mt-4'>
              <Divider />
              <div className='mt-2 text-center'>
                <div className='font-bold text-sm break-all'>{recipient}</div>
              </div>
              <div className='text-center mt-2'>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                >
                </Stack>
              </div>
            </div>
            {transactionStatus && (
              <p className='font-bold mt-4'>Transaction: {transactionStatus}</p>
            )}
          </>
        )}
        {tx && (
          <p className='font-bold mt-4'>
            Tx Completed: {(tx.transactionHash as string).substring(0, 6)}
            ...
            {(tx.transactionHash as string).substring(
              tx.transactionHash.length - 6,
              tx.transactionHash.length
            )}
          </p>
        )}

      </Card>
    </div>
  );
}
