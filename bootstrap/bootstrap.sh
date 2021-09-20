#/usr/bin/env bash
echo "Bootstrapping Geppetto"
USER=`whoami`
if [[ -v SKIP_SSM_USER ]]; then
  if [[ ${USER} = "root" ]]; then
    echo "This script needs to be run as a non-\"root\". Ensure correct setup."
    exit -1
  fi
else 
  if [[ ${USER} != "ssm-user" ]]; then
    echo "This script needs to be run as \"ssm-user\". Ensure correct setup."
    exit -1
  fi
fi

echo " - running as user ${USER}. Check successful."
echo " - Assuming user has \"sudo\" permissions with no need for password"

if [[ -f ~/.git-credentials]]; then
  HAVE_CREDS=$(cat ~/.git-credentials | grep -v bitbucket.org/ozoneapi | wc -l)
fi

if [[ ! -z $HAVE_CREDS && $HAVE_CREDS != 0 ]]; then
  echo "git https creds configured."
elif [[ -v GIT_HTTPS_CREDS ]]; then
  echo "persisteing git https creds"
  echo "https://$GIT_HTTPS_CREDS@bitbucket.org/ozoneapi" >> ~/.git-credentials
else
  echo "Export the git https credentials before running this script. Run:"
  echo "export GIT_HTTPS_CREDS=<username:app-password>"
  exit -1
fi

# ensure git is installed
if [[ ! -f /usr/bin/git ]]; then
  echo "- git is not installed on this system. Installing git..."
  sudo yum install -y git-core
  git config --global credential.helper store
fi

# check for status again
if [[ -f /usr/bin/git ]]; then
  echo "- git install check successful."
else
  echo "- git install check failed. Ensure it is installed correctly."
  exit -1
fi

# ensure git credentials configured for https://bitbucket.org
TMP_FILE="/tmp/cred-fill.txt"
[[ -f ${TMP_FILE} ]] && rm ${TMP_FILE}
echo "protocol=https" >> ${TMP_FILE}
echo "host=bitbucket.org" >> ${TMP_FILE}
echo "path=ozoneapi/geppetto.git" >> ${TMP_FILE}
# echo >> ${TMP_FILE}
git credential fill < ${TMP_FILE} > /dev/null 2> /dev/null && HAVE_CREDS=$? 
rm ${TMP_FILE}
if [[ $HAVE_CREDS != 0 ]]; then
  echo "- credential check failed. Please ensure git has the right credentials configured for https://bitbucket.org/ozoneapi/geppetto.git"
  exit -1
fi

OZONE_HOME="/usr/o3"
GEPPETTO_HOME=${OZONE_HOME}/geppetto

if [[ -d ${GEPPETTO_HOME} ]]; then
  echo "- Cleaning old ${GEPPETTO_HOME}"
  sudo rm -rf /usr/o3/geppetto
fi

echo "- Creating ${GEPPETTO_HOME}"
sudo mkdir -p ${GEPPETTO_HOME}

# assign right permissions
echo "- Assign user permissions to ${OZONE_HOME}"
sudo chown -R ${USER}:${USER} ${OZONE_HOME}

if [[ -v BRANCH ]]; then
  BRANCH_OPTS="--branch=${BRANCH}"
fi

echo "- Clone geppetto into ${GEPPETTO_HOME} ${BRANCH_OPTS}"
git clone ${BRANCH_OPTS} https://bitbucket.org/ozoneapi/geppetto ${GEPPETTO_HOME}

echo "Run the below command to bootstrap the environment:"
echo "sudo -iu ${USER} CONNECTOR_NAME=<my-connectors> /usr/o3/geppetto/scripts/install-ozone-stage1.sh"

