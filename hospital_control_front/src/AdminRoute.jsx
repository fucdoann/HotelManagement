import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Bookings,FormElements,Payments } from "./Views/AdminDashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "admin",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Thống kê tổng quan",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Thông tin cá nhân",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Khách sạn",
        path: "/hotels",
        element: <Tables />,
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "Đơn đặt phòng",
        path: "/bookings",
        element: <Bookings />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "Đơn thanh toán",
        path: "/payments",
        element: <Payments />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Thêm khách sạn",
        path: "/addHotel",
        element: <FormElements />,
      },
    ],
  },
];

export default routes;
