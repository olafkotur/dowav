package main
import(
	"log"
	"fmt"
)

func main() {
	ipPort := "localhost:8000" //ip:port
	userID := MakeUserID(ipPort)

	getBulbsResponse := getBulbs(userID, ipPort) //get all bulbs
	log.Println(getBulbsResponse)

	OnOFFLightResponse := OnOFFLight(userID, ipPort, true, 1) //true : on, false : off
	log.Println(OnOFFLightResponse)

	changeBrightResponse := changeBright(userID, ipPort, 1, 254) //can't change brightness while off
	log.Println(changeBrightResponse)

	changeColourResponse, fail := changeColour(userID, ipPort, "#513143", 8) //can't change colour while off
	log.Println(changeColourResponse)
	fmt.Println(fail)

	createGroupResponse := createGroup(userID, ipPort, "group", []int{1, 2})
	log.Println(createGroupResponse)

	modifyGroupResponse := modifyGroup(userID, ipPort, "group", 7, []int{1, 3})
	log.Println(modifyGroupResponse)

	getGroupResponse := getGroup(userID, ipPort, 7)
	log.Println(getGroupResponse)

	changeGroupColourResponse := changeGroupColour(userID, ipPort, "#613143", 7)
	log.Println(changeGroupColourResponse)

	OnOFFGroupLightResponse := OnOFFGroupLight(userID, ipPort, true, 7)
	log.Println(OnOFFGroupLightResponse)
}