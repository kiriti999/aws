# #!/usr/bin/env bash

# if [ -f cd "D:\Jenkins-master-slave\ci_node_agent_setup.sh" ]; then
#     source "D:\Jenkins-master-slave\ci_node_agent_setup.sh";
# elif [ -n "$NVM_LOCAL_INSTALL_DIR" ]; then
#     source $NVM_LOCAL_INSTALL_DIR/nvm.sh;
# fi

if [ -f ~/ci_agent_node_setup.sh ]; then
    source ~/ci_agent_node_setup.sh
elif [ -n "$NVM_LOCAL_INSTALL_DIR" ]; then
    source $NVM_LOCAL_INSTALL_DIR/nvm.sh
fi
