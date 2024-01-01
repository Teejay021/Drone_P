import classNames from "classnames";

function Button({children,primary,secondary,success,outline,rounded, ...rest}){



    const classes = classNames(
        
        rest.classname,
        "flex items-center "
        
    );

}

export default Button;