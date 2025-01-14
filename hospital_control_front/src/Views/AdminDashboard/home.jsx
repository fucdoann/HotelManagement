import React, { useState, useEffect } from "react";
import { axios } from '../../api/axios';
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "../../Components/cards";
import {
  projectsTableData,
  ordersOverviewData,
} from "../../data";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { ClassNames } from "@emotion/react";
export function Home() {
  const [statistics, setStatistics] = useState({
    totalIncome: 0,
    oldCustomers: 0,
    newCustomers: 0,
    totalBookings: 0,
    percentIncom : 0,
    percentBooking : 0,
  });
  const [listHotel,setListHotel] = useState({});
  useEffect(() => {
    // Fetch data when the component mounts
    const fetchStatistics = async () => {
      try {
        const response = await axios.post('/getDashBoard'); // Replace with your endpoint
        setStatistics({
          totalIncome: response.data.total_payment_amount || 0,
          oldCustomers: response.data.total_users_with_user_id || 0,
          newCustomers: response.data.total_users_without_user_id || 0,
          totalBookings: response.data.total_bookings || 0,
          percentIncom: response.data.percentageChange || 0,
          percentBooking: response.data.percentageChangeBooking || 0,
        });
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };
    const fetchHotels = () => {
      axios.post('/getListHotelDashboard')
        .then(res => {
          setListHotel(res.data.data);
        })
        .catch(error => {
          console.error(error);
        });
    };
    fetchStatistics();
    fetchHotels();
  }, []);
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <StatisticsCard
          key={'Tổng thu nhập'}
          title={'Tổng thu nhập'}
          value={`${statistics.totalIncome}`}
          color={"gray"}
          icon={React.createElement(BanknotesIcon, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-green-500"}>{`+${statistics.percentIncom}%`}</strong>
              &nbsp;{"so với tuần trước"}
            </Typography>
          }
        />
        <StatisticsCard
          key={'Khách hàng cũ'}
          title={'Khách hàng cũ'}
          value={statistics.oldCustomers}
          color={"gray"}
          icon={React.createElement(UsersIcon, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-green-500"}>{"+55%"}</strong>
              &nbsp;{"so với tháng trước"}
            </Typography>
          }
        />
        <StatisticsCard
          key={'Khách hàng mới'}
          title={'Khách hàng mới'}
          value={statistics.newCustomers}
          color={"gray"}
          icon={React.createElement(UserPlusIcon, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-green-500"}>{"+55%"}</strong>
              &nbsp;{"so với tháng trước"}
            </Typography>
          }
        />
        <StatisticsCard
          key={'Tổng đơn đặt'}
          title={'Tổng đơn đặt'}
          value={statistics.totalBookings}
          color={"gray"}
          icon={React.createElement(ChartBarIcon, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={"text-green-500"}>{`+${statistics.percentBooking}%`}</strong>
              &nbsp;{"so với tuần trước"}
            </Typography>
          }
        />
      </div>
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Khách sạn hoàn thiện
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>30 done</strong>
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray">
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currenColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem>Action</MenuItem>
                <MenuItem>Another Action</MenuItem>
                <MenuItem>Something else here</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className=" px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Khách sạn", "Phòng", "Giá tối thiểu", "Hoàn thiện"].map(
                    (el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-6 text-left"
                      >
                        <Typography
                          variant="small"
                          className="text-[11px] font-medium uppercase text-blue-gray-400"
                        >
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {listHotel.length > 0 && listHotel.map(
                  (item, key) => {
                    const className = `py-3 px-5 ${key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                      }`;

                    return (
                      <tr key={key}>
                        <td className={className}>
                          <div className="flex items-center gap-4">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-bold"
                            >
                              {item.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={className}>
                          {item.room_count}
                        </td>
                        <td className={className}>
                          <Typography
                            variant="small"
                            className="text-xs font-medium text-blue-gray-600"
                          >
                            {item.min_price}
                          </Typography>
                        </td>
                        <td className={className}>
                          <div className="w-10/12">
                            <Typography
                              variant="small"
                              className="mb-1 block text-xs font-medium text-blue-gray-600"
                            >
                              {100}%
                            </Typography>
                            <Progress
                              value={100}
                              variant="gradient"
                              color={100 === 100 ? "green" : "blue"}
                              className="h-1"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </Card>
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Orders Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {ordersOverviewData.map(
              ({ icon, color, title, description }, key) => (
                <div key={title} className="flex items-start gap-4 py-3">
                  <div
                    className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === ordersOverviewData.length - 1
                      ? "after:h-0"
                      : "after:h-4/6"
                      }`}
                  >
                    {React.createElement(icon, {
                      className: `!w-5 !h-5 ${color}`,
                    })}
                  </div>
                  <div>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="block font-medium"
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="span"
                      variant="small"
                      className="text-xs font-medium text-blue-gray-500"
                    >
                      {description}
                    </Typography>
                  </div>
                </div>
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
