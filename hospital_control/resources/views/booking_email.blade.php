<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đặt phòng</title>
</head>
<body>
    <h1>Cảm ơn bạn đã đặt phòng của chúng tôi!</h1>
    <p>Your payment of {{ $booking['amount'] }} VND has been successfully processed.</p>
    <p>Booking ID: {{ $booking['booking_id'] }}</p>
    <p>Status: {{ $booking['status'] }}</p>
</body>
</html>
