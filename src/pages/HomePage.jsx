import logo from '../assets/IPUC_COLOR para fondo oscuro (1).png'
import imagen1 from '../assets/grupo1.jpeg'
import imagen2 from '../assets/grupo2.jpeg'
import imagen3 from '../assets/grupo3.jpeg'
import biblia from '../assets/biblia.png'
import imagen4 from '../assets/grupo4.jpeg'
import imagen5 from '../assets/grupo5.jpeg'
import imagen6 from '../assets/grupo6.jpeg'
import imagen7 from '../assets/grupo7.jpeg'
import encuentro1 from '../assets/encuentro1.jpeg'
import encuentro2 from '../assets/encuentro2.jpeg'
import encuentro3 from '../assets/encuentro3.jpeg'
import clase from '../assets/clase1.jpeg'
import clase1 from '../assets/clase2.jpeg'
import clase2 from '../assets/clase3.jpeg'
import clase3 from '../assets/clase4.jpeg'
import clase4 from '../assets/clase5.jpeg'
import clase5 from '../assets/clase6.jpeg'
import clase6 from '../assets/clase7.jpeg'
import clase7 from '../assets/clase8.jpeg'
import clase8 from '../assets/clase9.jpeg'
import clase9 from '../assets/clase10.jpeg'
import clase10 from '../assets/clase11.jpeg'
import clase11 from '../assets/clase12.jpeg'
import clase12 from '../assets/clase13.jpeg'
import clase13 from '../assets/clase14.jpeg'
import clase14 from '../assets/clase15.jpeg'
import material1 from '../assets/material1.jpeg'
import material2 from '../assets/material2.jpeg'
import material3 from '../assets/material3.jpeg'
import material4 from '../assets/material4.jpeg'
import wave from '../assets/wave.png';

import { FiAlignJustify } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaGooglePlus } from "react-icons/fa6";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { BiMinusFront } from "react-icons/bi";

import React, { useState, useEffect } from 'react';
import Slider from "react-slick";

import ImageSlider from '../components/ImageSlider';
function HomePage() {

    const redirectToLink = () => {
      // Redirigir al usuario a la URL deseada
      window.location.href = 'https://ipuc.org.co/';
    };


    const encuentros = [
      {url:encuentro1},
      {url:imagen6},
      {url:imagen7},
      {url:imagen3},
      {url:encuentro2},
      {url:encuentro3},
      {url:imagen5},
    ]

    const clases=[
      {url:clase},
      {url:clase1},
      {url:clase2},
      {url:clase3},
      {url:clase4},
      {url:clase5},
      {url:clase6},
      {url:clase7},
      {url:clase8},
      {url:clase9},
      {url:clase10},
      {url:clase11},
      {url:clase12},
      {url:clase13},
      {url:clase14},
    ]
    const materiales=[
      {url:material1},
      {url:material2},
      {url:material3},
      {url:material4},
    ]

    const containerStyles = {
      width: "400px",
      height: "220px",
      margin: "0 auto",
    };

    const [menuOpen, setMenuOpen] = useState(false);

   
    return(
        <>


<header className=' shadow-md w-full fixed top-0 left-0 '> 
  <div className='lg:flex bg-white py-4 lg:px-10 px-7 items-center justify-between '>

    <div className='font-bold text-2xl cursor-pointer 
    flex items-center poppins text-gray-800'>
       <img className="w-32 ml-8" src={logo} alt="logo" />
    </div>
   
     {/* Botón para abrir el menú */}
     <div className={`text-3xl cursor-pointer absolute right-8 top-6 lg:hidden ${menuOpen ? 'hidden' : ''}`} onClick={()=>setMenuOpen(!menuOpen)}>
    <FiAlignJustify size={42} className='m-8' /> </div>

  {/* Botón para cerrar el menú */} 
    <div className={`text-3xl cursor-pointer absolute right-8 top-6 lg:hidden ${menuOpen ? '' : 'hidden'}`} onClick={()=>setMenuOpen(!menuOpen)}>
        <IoCloseSharp size={42} className='m-8' />
      </div>

     <ul className={`lg:flex lg:items-center lg:pb-0 pb-9 absolute
     lg:static bg-white lg:z-auto z-[-1] left-0 w-full lg:w-auto
     lg:pl-0 pl-9 transition-all duration-500 ease-in pt-6
      ${menuOpen ? 'top-20 opacity-100' : 'top-[-490px]'} lg:opacity-100 opacity-0`}>
      
         <li className=" lg:ml-12 text-xl lg:my-0 my-7 ">
            <a href="" className='carrois-gothicSC text-gray-800 hover:text-blue-400 duration-500'>INICIO</a>
          </li>
          <li className=" lg:ml-12 lg:my-0 my-7 text-xl "> 
            <a href="#quehacemos" className='carrois-gothicSC text-gray-800 hover:text-blue-400 duration-500' >¿QUÉ HACEMOS?</a>
          </li>
          <li className=" lg:ml-12 text-xl lg:my-0 my-7">
            <a href="#quienesSomos" className='carrois-gothicSC text-gray-800 hover:text-blue-400 duration-500'>¿QUIÉNES SOMOS?</a>
          </li>
          <li className=" lg:ml-12 text-xl lg:my-0 my-7">
            <a href="/login"><FaUserCircle className="w-8 h-8 mr-6 hover:text-blue-400 duration-500" /></a>
          </li> 

      </ul>
    </div>
 </header>
 
   <section className='flex flex-col lg:flex-row items-center bg-blue-900 h-auto lg:h-96 mt-32'>
     <div className='w-full  text-white px-8 lg:pr-4  lg:ml-24 ml-0' >
       <h1 className='text-white text-center font-bold text-[36px] poppins lg:mt-0 mt-12 lg:mb-0 mb-12'>Cada momento dedicado a la lectura y estudio de la Biblia es una inversión eterna en nuestro crecimiento espiritual.</h1>
     </div>
     <div className='w-full  flex justify-center lg:mb-0 mb-12'>
        <img className=" lg:w-96  w-80 rounded-xl lg:mr-24 mr-0" src={imagen1} alt="grupo" />
     </div>
   </section>
<div className='mt-24 mb-12 text-center text-blue-900 font-bold text-[28px] carrois-gothicSC  '> <h1 className='text-shadow-lg'>DATOS IMPORTANTES</h1></div>
<div className="flex flex-col lg:flex-row lg:justify-evenly items-center">

  <div className='bg-yellow-900 text-white w-64 h-40 rounded-full flex flex-col justify-center
   items-center shadow-xl mb-4 lg:mb-0 '>
    <div className="text-center  text-[50px] font-bold poppins"> 56</div>  
    <div className="text-center text-[20px] font-thin carrois-gothic">Sectores</div>
  </div>

  <div className='bg-yellow-900 text-white w-64 h-40 rounded-full flex flex-col justify-center 
  items-center shadow-xl mb-4 lg:mb-0 '>
    <div className="text-center text-[50px] font-bold poppins">9</div>  
    <div className="text-center text-[20px] font-thin carrois-gothic">Distritos</div>
</div>

  <div className='bg-yellow-900 text-white w-64 h-40 rounded-full flex flex-col justify-center
   items-center shadow-xl mb-4 lg:mb-0 '>
    <div className="text-center  text-[50px] font-bold poppins">13</div>  
    <div className="text-center text-[20px] font-thin carrois-gothic"> Obras Misioneras</div>
  </div>
</div>


<section id="quehacemos" className='flex flex-col lg:flex-row items-center h-auto lg:h-80 mt-24'>
  <div className='w-full  flex justify-center  '>
    <img className="w-96 rounded-lg lg:ml-24 ml-0" src={imagen2} alt="grupo" /> 
  </div>
  <div className='w-full lg:mr-24 mr-0'>
    <h1  className='text-center font-bold text-[30px] mb-2 poppins'>¿QUÉ HACEMOS?</h1>
    <h2 className=' text-center text-[22px] carrois-gothic'>Formamos parte de la Iglesia Pentecostal Unida de Colombia y nos dedicamos con pasión a impartir clases bíblicas exclusivamente a niños. Nuestra labor busca proporcionar una guía espiritual sólida y significativa a esta etapa crucial de la vida.</h2>
  </div>
</section>


 <div className='bg-blue-900 mt-12'>
 <img className="transform  scale-y-[-1] w-full h-24" src={wave} alt="grupo" /> 
   <section className='flex flex-col lg:flex-row items-center mt-6 bg-blue-900 text-white h-auto lg:h-96'>
  <div className='w-full  px-8 lg:pr-4  lg:ml-24 ml-0'>
    <h1 className='text-center font-bold text-[22px]  poppins lg:mt-0 mt-12 lg:mb-0 mb-12'>¿CUÁL ES NUESTRO OBJETIVO?</h1>
    <h2 className='text-center text-[22px] carrois-gothic lg:mt-0 mt-12 lg:mb-0 mb-12'>En nuestras clases, abordamos diversos temas bíblicos adaptados a sus necesidades y niveles de comprensión, fomentando no solo el conocimiento sino también el crecimiento espiritual y la comunión entre los jóvenes.</h2>
  </div>
  <div className='w-full  '>
    <img className="lg:w-96  w-96 rounded-lg lg:mr-24 mx-auto mb-12" src={imagen3} alt="grupo" />
  </div>
</section></div>


<div className='flex flex-col items-center mt-24 mb-24'>
  <h1 className="text-center text-[33px] font-bold m-12 carrois-gothic ">Creemos firmemente que esta educación basada en la Palabra de Dios es esencial para fortalecer su fe y orientarlos en su camino hacia la salvación</h1>
  <img className="w-96 rounded-lg" src={biblia} alt="grupo" />
</div>

<section id="quienesSomos" className='flex flex-col lg:flex-row items-center h-auto lg:h-80 mt-24'>
  <div className=' w-full flex justify-center '>
  <img className=" w-full lg:w-96 rounded-lg mx-auto" src={imagen4} alt="grupo" />
  </div>
  <div className='w-full  px-8 flex flex-col items-center'>
  <h1 className='font-bold text-[22px] mb-2 poppins lg:mr-24 mr-0'>¿QUIÉNES SOMOS?</h1>
  <h2 className=' text-[22px] mb-6 carrois-gothic lg:mr-24 mr-0 text-center'>La Iglesia Pentecostal Unida de Colombia (IPUC) es una denominación cristiana pentecostal unicitaria en Colombia, completamente autónoma (dirigida netamente por colombianos).</h2>
  <button className="bg-blue-500 py-2 px-4 rounded-lg hover:text-white poppins lg:mr-24 mr-0" onClick={redirectToLink}> <div className='flex'>Conoce más <BiMinusFront className='ml-4 mt-1'/></div></button>
</div>
</section>

<div className='bg-blue-900 lg:mt-6'> 
<img className="transform scale-x-[-1] scale-y-[-1] w-full h-24 " src={wave} alt="grupo" /> 
   <div className=' mt-6 justify-around h-auto lg:h-96 flex flex-col lg:flex-row items-center text-white'>
  <div className="mb-8 lg:mb-0">
    <h1 className='text-center font-bold text-[22px] poppins mb-8'>CLASES</h1>
    <div className="lg:w-96" style={containerStyles}> <ImageSlider slides={clases} /> </div>
  </div>

  <div className="mb-8 lg:mb-0">
    <h1 className='text-center font-bold text-[22px] poppins mb-8'>ENCUENTROS</h1>
    <div className="lg:w-96" style={containerStyles}> <ImageSlider slides={encuentros} /> </div>
  </div>

  <div className="mb-8 lg:mb-0">
    <h1 className='text-center font-bold text-[22px] poppins mb-8'>MANUALIDADES</h1>
    <div className="lg:w-96" style={containerStyles}> <ImageSlider slides={materiales} /> </div>
  </div>
</div> </div>




<section className='flex flex-col lg:flex-row items-center h-auto lg:h-80 mt-6 lg:mt-0'>
  <div className='w-full lg:w-1/2 px-8 lg:px-4 lg:mb-4'>
    <h1 className='text-center font-bold text-[16px] mb-2 carrois-gothicSC'>ENCUENTRANOS</h1>
    <div className='flex justify-center space-x-4 lg:space-x-8'>
      <FaFacebook size={36} className="mx-2"/>
      <RiInstagramFill size={36} className="mx-2"/>
      <FaGooglePlus size={36} className="mx-2"/>
      <FaMapMarkedAlt size={36} className="mx-2"/>
    </div>
  </div>
  <div className='w-full lg:w-1/2 px-8 lg:px-4 lg:mb-4'>
    <h1 className='text-center font-bold text-[22px] mb-2 poppins'>SE PARTE DE NUESTRA GRAN COMUNIDAD</h1>
  </div>
  <div className='w-full lg:w-1/2 px-8 flex justify-center'>
    <img className="w-52 mx-auto" src={logo} alt="logo" />
  </div>
</section>

        </>
    )
}

export default HomePage