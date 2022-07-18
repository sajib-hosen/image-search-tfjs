import React, { useEffect, useRef, useState } from 'react';
import * as mobilenet from "@tensorflow-models/mobilenet";
import '@tensorflow/tfjs-backend-webgl';

const SearchBox = () => {

    const [ modelLoading, setModelLoading ] = useState( false );
    const [ imgUrl, setImgUrl ] = useState( null );
    const [ models, setModels ] = useState( null );
    const [ prediction, setPrediction ] = useState([]);

    const imgRef = useRef();
    const imgWebRef = useRef();

    const loadModels = async ()=>{
        setModelLoading( true );
        try{
            const model = await mobilenet.load();
            setModels( model );
            setModelLoading( false );
        }
        catch ( error ){
            console.log( error );
            setModelLoading( false );
        }
    }


    const imgUpload = (e) =>{
        const { files } = e.target;
        if(files.length){
            const url = URL.createObjectURL( files[0] );
            setImgUrl( url );
        }
        else{
            setImgUrl( null );
        }
    }



    const findName = async ()=>{
        const result = await models.classify( imgRef.current );
        setPrediction( result );
        imgWebRef.current.value = "";
    }



    const handleWebImgUrl = (e)=>{
        setImgUrl( e.target.value );
        setPrediction([]);
    }


    useEffect(()=>{
        loadModels();
    },[]);



    console.log( prediction )


    if(modelLoading){
        return <h2>Model is loading ...</h2>
    }


 
    return (
        <div>

            <div className='border p-3 flex flex-row justify-center items-center  '>
                {/* <h5>search box</h5> */}
                <input className='border p-2 ' onChange={ imgUpload } type="file" name="searchImg" id="searchImg" accept='image/*' capture='camera' />
                <input className='border p-2' type="text" placeholder='Image URL or Product Name' name="img web url" id="img-web-url" ref={imgWebRef} onChange={ handleWebImgUrl } />
                { imgUrl ? <button className='border p-2 ' onClick={findName}>Search</button> : null }
            </div>

            <div>

                <h2>Img Preview</h2>
                <div className='flex border'>
                    <div className='' style={{ width: "250px", }} >
                        { imgUrl ? <img style={{width: "100%" }} src={ imgUrl } ref={imgRef} alt="uploaded image" crossOrigin='anonymous' /> : null }
                    </div>
                    <div>
                        { prediction.length ? prediction.map((eachPre, index)=><div key={index}>
                            <p>{index+1}, { eachPre.className } =&gt; { eachPre.probability}</p>
                        </div> ): null }
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SearchBox;