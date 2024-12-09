import sys , os

def router(args):
    routerName = args[0]

    print(f"Creating router {routerName}...")

    if os.path.exists(f"/app/routes/{routerName}.py"):
        print(f"Router {routerName} already exists")
        return
    
    os.system(f"touch /app/routes/{routerName}.py")

    with open(f"/app/routes/{routerName}.py" , "w") as f:
        f.write(
            """
            from fastapi import APIRouter

            router = APIRouter()

            """
        )
    

def main(args=sys.argv):
    
    command = args[1]

    accemptedCommands = ["router"]

    args = args[2:]

    if command not in accemptedCommands:
        print(f"Command make {command} not accempted")

    if command == "router":
        router(args)

    return
