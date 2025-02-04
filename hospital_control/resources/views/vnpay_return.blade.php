<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Status</title>
</head>
<body>
    <p>Processing payment...</p>
    <script>

        // Send the status to the parent window (booking page)
        window.opener.postMessage(
            {
                status: "{{ $status }}",
                vnp_TxnRef: "{{ $vnp_TxnRef }}",
                amount: "{{ $amount }}",
                vnp_OrderInfo: "{{ $vnp_OrderInfo }}",
                vnp_TransactionNo: "{{ $vnp_TransactionNo }}",
                vnp_BankCode: "{{ $vnp_BankCode }}",
                vnp_PayDate: "{{ $vnp_PayDate }}",
            },
            "http://localhost:3000" // Specify the exact origin of the parent window
        );

        // Close the payment window
        window.close();
    </script>
</body>
</html>
