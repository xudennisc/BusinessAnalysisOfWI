package pre;

public class allStart {

	public static void main(String args[]) {
		
		
		dataPre myPre1 = new dataPre();
		//myPre1.getText("/Users/Dennis/Java/workspace/591Processing/WI/tipWI.json",
			//	"/Users/Dennis/Java/workspace/591Processing/WI/wiTip");
		
		
		scorePre myPost1 = new scorePre();//tipText3Out_fake
		//myPost1.getScore("/Users/Dennis/Java/workspace/591Processing/WI/wiTipOut.txt", 
			//	"/Users/Dennis/Java/workspace/591Processing/Score/tmpScore.csv");
		//myPost1.getScore2("/Users/Dennis/Java/workspace/591Processing/Score/tmpScore.csv", 
			//"/Users/Dennis/Java/workspace/591Processing/Score/wiTipFinal.txt");
		//myPost1.findStr("/Users/Dennis/Java/workspace/591Processing/Score/newScore.csv", "Yaqing.");
		//myPost1.addPro("/WI/tipWI.json", "/Score/wiTipFinal.txt", "/WI/tipWIcombine.json");
		//myPost1.addPro("/yelp_dataset/reviewNoAZ.json", "/Score/wiTipFinal.txt", "/yelp_dataset/reviewNoAZcom.json");
		//review combine
		//myPost1.combRev("/WI/reviewWIcombine.json", "/WI/businessWI.json", "/WI/wiBR_fake.json");
		//chk combine
		//myPost1.combRev("/WI/checkinWI.json", "/WI/wiBR.json", "/WI/wiBRC_facke.json");
		
		dtFilter myPre3 = new dtFilter();
		//myPre3.dtSelect("/Users/Dennis/Java/workspace/591Processing/yelp_dataset/", 
			//	"business.json", "business_lite.json");
		//find all comments
		//myPre3.findStr("/Users/Dennis/Java/workspace/591Processing/yelp_dataset/reviewsample.json",
			//	"bussiness_id", "x5Mv61CnZLohZWxfCVCPTQ");
		//another way to check 0 review store
		//myPre3.orderSelect("/Users/Dennis/Java/workspace/591Processing/yelp_dataset/", 
		//		"storeList2.txt", "review.json", "WI151.json");
		//myPre3.selectByAttr("/Users/Dennis/Java/workspace/591Processing/yelp_dataset/", 
			//	"storeListWI.txt", "checkin.json", "checkinWI.json");
		
		dtFinder myPre4 = new dtFinder();
		//for(int i=151; i<2118; i++){
		//myPre4.chkNum("/Users/Dennis/Java/workspace/591Processing/yelp_dataset/", "storeList2.txt", "review.json", i );
		//}
		
		jsonCovert myPost2 = new jsonCovert();
		//myPost2.jCov("wiBRC.json", "wiBRC_edited.json");
		myPost2.jCov("user.json", "userID.txt");
		
		
	}
}
