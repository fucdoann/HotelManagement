import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "../../Components/cards";
import { platformSettingsData, conversationsData, projectsData } from "../../data";
import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthProvider";
import {axios} from '../../api/axios'
import { useForm } from 'react-hook-form'
import SuccessPop from "../../Components/PopUp/SuccessPop";

export function Profile() {
  const {
    register,
    formState: {errors},
    handleSubmit,
    setValue
  } = useForm()
  const { user } = useAuth();
  const [name , setName] = useState(user.name || '');
  const [email , setEmail] = useState(user.email || '');
  const [phone , setPhone] = useState(user.user_phone || '');
  const [update , setUpdate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [listHotel, setListHotel] = useState({});
  const baseUrl = import.meta.env.VITE_IMAGE_URL

    const onSubmit = handleSubmit((data) => {
      axios.post('/changeuser', data)
      .then(res => {
          if(res.data.status ===200){
              setUpdate(true);
              setIsEditing(false);

          }
      })
      .catch(err => console.log(err))
    })
    const showForm = () => {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("user_phone", user.user_phone || "");
      setIsEditing(true);
    }
         useEffect(() => {
            const fetchHotels = () => {
                  axios.post('/getListHotelDashboard')
                    .then(res => {
                      setListHotel(res.data.data);
                    })
                    .catch(error => {
                      console.error(error);
                    });
                };
                fetchHotels();
          },[])
  return (
    <>
      {update && <SuccessPop mess="Cập nhập hồ sơ thành công" onClose={() => setUpdate(false)}/>}
    
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  Richard Davis
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Quản trị viên
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Cài đặt thông báo
              </Typography>
              <div className="flex flex-col gap-12">
                  <div>
                    <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                      Cài đặt thông báo
                    </Typography>
                    <div className="flex flex-col gap-6">
                    
                        <Switch
                          id={''}
                          label={'Thông báo qua email cho người dùng khi đặt khách sạn'}
                          defaultChecked={'checked'}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                        <Switch
                          id={''}
                          label={'Thông báo cho tôi khi có người đặt khách sạn'}
                          defaultChecked={'checked'}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                        <Switch
                          id={''}
                          label={'Thông báo cho tôi khi có tin nhắn'}
                          defaultChecked={''}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                    </div>
                  </div>
               
              </div>
            </div>
            {isEditing ? (
          <form onSubmit={e => e.preventDefault()} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                name="name"
                {...register("name", { required: "First name is required" })}
                className="mt-1 p-4 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required=""
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile
              </label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                {...register("user_phone", { required: "Mobile number is required" })}
                className="mt-1 p-4 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.user_phone && <p className="text-red-500 text-sm">{errors.user_phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                {...register("email", { required: "Email is required" })}
                className="mt-1 p-4  block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                value={'Viet Nam'}
                {...register("address", { required: "Location is required" })}
                className="mt-1 p-4  block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                className="px-4 py-2 text-sm text-white bg-[#616161] rounded shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <>
            <ProfileInfoCard
              title="Profile Information"
              description="Chào bạn, đây là trang thông tin cá nhân của admin. Bạn có thể bấm vào biểu tượng chỉnh sửa để chỉnh sửa thông tin và bấm SAVE để hoàn thiện"
              details={{
                "name": `${name}`,
                mobile: `${phone}`,
                email: `${email}`,
                location: "Viet Nam",
                social: (
                  <div className="flex items-center gap-4">
                    <i className="fa-brands fa-facebook text-blue-700" />
                    <i className="fa-brands fa-twitter text-blue-400" />
                    <i className="fa-brands fa-instagram text-purple-500" />
                  </div>
                ),
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon onClick={showForm}  className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
            </>
        )}
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Tin nhắn với người đặt
              </Typography>
              <ul className="flex flex-col gap-6">
                {conversationsData.map((props) => (
                  <MessageCard
                    key={props.name}
                    {...props}
                    action={
                      <Button variant="text" size="sm">
                        reply
                      </Button>
                    }
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Khách sạn đã tạo
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Khách sạn nổi bật
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {listHotel.length > 0 && listHotel.slice(0,4).map(
                (item, key) => (
                  <Card key={key} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={`${item.images.length ? baseUrl + item.images[0] : 'https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg'}`}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        #Project{key+1}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {item.description.length > 40 ? item.description.substring(0, 40) + "..." : item.description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={'/'}>
                        <Button variant="outlined" size="sm">
                          view project
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
