import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

function WelcomePage() {
    return(
        <div className='mt-2 flex grow flex-col gap-4 md:flex-row'>
            {/*Bienvenida*/}
            <div className="flex flex-col gap-4 px-5 py-5 md:w-100 md:px-10">
                <p className="py-3 text-xl md:text-2xl font-semibold">¡Hola!</p>
                <strong className="px-10 py-3 text-4xl md:text-5xl">Administrador</strong>
                
                <div className="flex flex-col gap-5 px-10 py-10">
                    <Link className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
                        href="" //ruta a la que lleva
                        ><PlusCircleIcon className="w-6" /> <span>REALIZAR NUEVO EVENTO</span> 
                    </Link>

                    <Link
                        className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
                        to='/administrador/docentes/register' // Cambiado de href a to
                    >
                        <PlusCircleIcon className="w-6" />
                        <span>INGRESAR DOCENTE</span>
                    </Link>
                    <Link
                        className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
                        to='/administrador/estudiantes/registrar' // Cambiado de href a to
                    >
                        <PlusCircleIcon className="w-6" />
                        <span>INGRESAR ESTUDIANTE</span>
                    </Link>

                    
                    <Link className="flex gap-3 justify-start rounded-lg bg-custom-brown1 px-5 py-3 text-base font-light text-white transition-colors hover:bg-custom-brown2"
                        href="/" //ruta a la que lleva
                        ><PlusCircleIcon className="w-6" /> <span >CREAR CURSO</span> 
                    </Link>
                </div>
            </div>
            
            {/*Versiculo de bienvenida*/}
            <div className="flex flex-col gap-3 ml-3 mr-3 mt-5 py-8 md:mt-0">
                <p className="text-custom-brown2 text-xl text-center">
                VERSICULO DEL DIA
                </p>
                <p className="text-white text-2xl md:text-3xl font-medium text-center bg-custom-brown2 rounded-lg ml-5 mr-5 mt-5 px-5 py-10 md:ml-10 md:mr-10 md:py-16 md:px-10">
                    <strong>
                        Porque tanto amó Dios al mundo que dio a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna.
                    </strong>
                <p className='mt-5 text-base md:mt-10 md:text-2xl'>
                    Juan 3:16
                </p>
                </p>
            </div>
        </div>
    );
}

export default WelcomePage