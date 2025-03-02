import { LoginForm } from "../components/auth/login"
import '/public/auth.css'

export default function LoginPage(){

    return(
        <div className="h-screen flex justify-center items-center font-bold">

            <div className="bg-green-500 rounded-md p-6 w-[35%] h-[70%] flex flex-col items-center text-white gap-5">
                <div className="flex flex-col justify-center items-center gap-2 mt-12">
                    <img 
                        src="/img/city_logo.jpg" 
                        alt="City Agriculture Logo" 
                        className="rounded-full w-[40%]"
                    />

                    <h1 className="text-3xl">Welcome to Fruitection</h1>

                </div>

                <h1 className="text-sm text-center opacity-75">Stay informed with the latest statistics on diseases affecting durian crops. Get crucial data to support farmers and researchers in tackling health challenges in durian cultivation.</h1>

            </div>

            <div className="w-[35%] h-[70%] bg-gray-200 rounded-md p-5 flex flex-col items-center justify-center">
                <h1 className="font-bold text-slate-950 text-3xl pb-5">Sign in your account</h1>
                <LoginForm />
            </div>
        </div>
    )
}

