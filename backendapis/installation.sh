#!/bin/bash

echo " "
echo " "
echo " "
echo " "
echo " "

echo " _____        _           _____     _ _              __  __            _        _         _ "               
echo "|  __ \      | |         / ____|   | | |            |  \/  |          | |      | |       | |"               
echo "| |  | | __ _| |_ __ _  | |     ___| | | __ _ _ __  | \  / | __ _ _ __| | _____| |_ _ __ | | __ _  ___ ___ "
echo "| |  | |/ _\` | __/ _\` | | |    / _ \ | |/ _\` | '__| | |\/| |/ _\` | '__| |/ / _ \ __| '_ \| |/ _\` |/ __/ _ \\"
echo "| |__| | (_| | || (_| | | |___|  __/ | | (_| | |    | |  | | (_| | |  |   <  __/ |_| |_) | | (_| | (_|  __/"
echo "|_____/ \__,_|\__\__,_|  \_____\___|_|_|\__,_|_|    |_|  |_|\__,_|_|  |_|\_\___|\__| .__/|_|\__,_|\___\___|"
echo "                                                                                   | |                     "
echo "                                                                                   |_| "

echo " "
echo " "
echo " "
echo " "
echo " "

echo -e "\033[1;33mWE RECOMMAND TO USE AUTOMATIC INSTALLATION IF YOU ARE ON LINUX OS OR WSL \033[0m"

echo " "

function sanityCheck(){
    if hash docker-compose 2>/dev/null; then
        echo -e "\033[37;42mDocker correctly installed\033[0m"
    else
        echo -e "\033[1;41mDocker not installed\033[0m"
    fi

    if hash git 2>/dev/null; then
        echo -e "\033[37;42mGit correctly installed\033[0m"
    else
        echo -e "\033[1;41mGit not installed\033[0m"
    fi

    if hash npm 2>/dev/null; then
        echo -e "\033[37;42mnpm correctly installed\033[0m"
    else
        echo -e "\033[1;33mnpm not installed\033[0m"
    fi

    if hash node 2>/dev/null; then
        echo -e "\033[37;42mNode correctly installed\033[0m"
    else
        echo -e "\033[1;41mNode may not be installed\033[0m"
    fi
}

#start_time=$(date +%s.%N)

sanityCheck

#end_time=$(date +%s.%N)

compose_file="docker-compose.yml"

#check file is in the path
if [ ! -e "$compose_file" ]; then
    echo -e "\033[1;41mdocker-compose file not found. Check you are running the script in the right path\033[0m"
    exit 1
fi

echo " "
echo " "

npm install

if [ $? -ne 0 ]; then
    echo -e "\033[1;41mError during installing dependencies with npm install\033[0m"
    exit 1
fi

echo " "
echo " "

echo -e "\033[37;42m**********************************************\033[0m"
echo -e "\033[37;42m**********************************************\033[0m"
echo -e "\033[37;42m** Project dependencies correctly installed **\033[0m"
echo -e "\033[37;42m**********************************************\033[0m"
echo -e "\033[37;42m**********************************************\033[0m"

echo " "
echo " "

echo -e "\033[37;42m*******************************************\033[0m"
echo -e "\033[37;42m*******************************************\033[0m"
echo -e "\033[37;42m** Creation of container docker started! **\033[0m"
echo -e "\033[37;42m*******************************************\033[0m"
echo -e "\033[37;42m*******************************************\033[0m"

echo " "
echo " "

#Run containers
docker-compose up -d

#check
if [ $? -ne 0 ]; then
    echo -e "\033[37;41mError during docker-compose up -d, check Docker safety\033[0m"
    exit 1
fi

echo " "
echo " "

echo -e "\033[37;42m*********************************************\033[0m"
echo -e "\033[37;42m*********************************************\033[0m"
echo -e "\033[37;42m** docker container correctly initialized! **\033[0m"
echo -e "\033[37;42m*********************************************\033[0m"
echo -e "\033[37;42m*********************************************\033[0m"

echo " "
echo " "

echo -e "\033[37;42m*************************************\033[0m"
echo -e "\033[37;42m*************************************\033[0m"
echo -e "\033[37;42m** Database initialization started **\033[0m"
echo -e "\033[37;42m*************************************\033[0m"
echo -e "\033[37;42m*************************************\033[0m"

sleep 4
npx prisma migrate dev

if [ $? -ne 0 ]; then
    echo -e "\033[37;41mError during database initialization. Problem is probabably related with prisma. Check migration file\033[0m"
    exit 1
fi

echo " "
echo " "

echo -e "\033[37;42m*************************************\033[0m"
echo -e "\033[37;42m*************************************\033[0m"
echo -e "\033[37;42m** Database correctly initialized! **\033[0m"
echo -e "\033[37;42m*************************************\033[0m"
echo -e "\033[37;42m*************************************\033[0m"

echo " "
echo " "

echo -e "\033[37;42m************************\033[0m"
echo -e "\033[37;42m************************\033[0m"
echo -e "\033[37;42m** Git clone started! **\033[0m"
echo -e "\033[37;42m************************\033[0m"
echo -e "\033[37;42m************************\033[0m"

echo " "
echo " "

cd ..
git clone https://gitlab.com/FutureCitiesCommunities/Blockchain/data-cellar/smartcontracts.git

if [ $? -ne 0 ]; then
    echo -e "\033[37;41mError during git clone command, check allowances that repo\033[0m"
    exit 1
fi

echo " "
echo " "

echo -e "\033[37;42m***********************************\033[0m"
echo -e "\033[37;42m***********************************\033[0m"
echo -e "\033[37;42m** Git clone correctly executed! **\033[0m"
echo -e "\033[37;42m***********************************\033[0m"
echo -e "\033[37;42m***********************************\033[0m"

echo " "
echo " "

cd smartcontracts/
npm install

if [ $? -ne 0 ]; then
    echo -e "\033[37;41mError during installing dependencies with npm install\033[0m"
    exit 1
fi

echo " "
echo " "

echo -e "\033[37;42m**********************************************\033[0m"
echo -e "\033[37;42m**********************************************\033[0m"
echo -e "\033[37;42m** Project dependencies correctly installed **\033[0m"
echo -e "\033[37;42m**********************************************\033[0m"
echo -e "\033[37;42m**********************************************\033[0m"

echo " "
echo " "

#upload smart contracts
echo -e "\033[37;42m*******************************************************\033[0m"
echo -e "\033[37;42m*******************************************************\033[0m"
echo -e "\033[37;42m** Smart contracts upload to the Blockchain started! **\033[0m"
echo -e "\033[37;42m*******************************************************\033[0m"
echo -e "\033[37;42m*******************************************************\033[0m"

echo " "
echo " "

npx truffle migrate
sleep 1
cp build/contracts/DataCellarToken.json ../backendapis/src/utils/misc
cp build/contracts/ERC20template.json ../backendapis/src/utils/misc
cp build/contracts/ERC721template.json ../backendapis/src/utils/misc
cp build/contracts/FactoryERC721.json ../backendapis/src/utils/misc

if [ $? -ne 0 ]; then
    echo -e "\033[37;41mError during the uploading of Smart Contracts\033[0m"
    exit 1
fi

echo " "
echo " "

echo -e "\033[37;42m*****************************************\033[0m"
echo -e "\033[37;42m*****************************************\033[0m"
echo -e "\033[37;42m** Smart contracts correctly uploaded! **\033[0m"
echo -e "\033[37;42m*****************************************\033[0m"
echo -e "\033[37;42m*****************************************\033[0m"

echo " "
echo " "

cd ../backendapis
npm run start:dev

if [ $? -ne 0 ]; then
    echo -e "\033[37;41mImpossible to run the application at port 3000\033[0m"
    exit 1
fi

exit 0