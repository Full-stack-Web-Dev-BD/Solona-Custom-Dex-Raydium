const keypair = Keypair.fromSecretKey(bs58.decode('YOUR_SECRET_KEY'));
 
let txid;
 
if (res.type === 'v0' ) {
  const txn = VersionedTransaction.deserialize(serializedTransactionBuffer);
  txn.sign([keypair]);
 
  txid = await connection.sendRawTransaction(txn.serialize(), {
    skipPreflight: true,
  });
} else {
  const txn = Transaction.from(serializedTransactionBuffer);
  txn.sign(keypair);
  const rawTransaction = txn.serialize();
  txid = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true,
  });
}