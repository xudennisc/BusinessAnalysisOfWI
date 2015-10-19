package pre;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;

public class bruteForce {
public void chkReview( String path, String refFile, String targetFile, int curIndex ) {
		
		BufferedReader brr = null;
		BufferedReader brt = null;
		String rLine = null;
		String tLine = null;
		int counter = 0;
		try{
			
			String refPath = path + refFile;
			String targetPath = path + targetFile;
			String outPath = path + "WIout.json";
			String chkPath = path + "numChk.txt";
			
			brr = new BufferedReader( new FileReader(refPath) );
			brt = new BufferedReader( new FileReader(targetPath) );
			
			List<String> store = new ArrayList<String>();
			while( (rLine = brr.readLine()) != null ){
				store.add(rLine);
			}
			brr.close();
			String[] storeList = store.toArray(new String[store.size()]);
			System.out.println( "storeList.length = " + storeList.length );
			
			File file = new File(outPath);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bwj = new BufferedWriter(fw);
			
			int idxCnt = 0;
			//check a certain store
			System.out.print(storeList[curIndex]+ "\t");
			while( (tLine = brt.readLine()) != null ){
				JSONObject jObj = new JSONObject(tLine);
				if( storeList[curIndex].compareTo( jObj.getString("business_id") ) == 0){
					idxCnt++;
					bwj.write(tLine);
				}
			}

			System.out.print("Total records for " + curIndex + ": " + idxCnt + "\r");
			bwj.close();
			
		}catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        }catch (IOException ioe) {
            ioe.printStackTrace();
        }finally{
        	try {
				if ( brt != null ) brt.close();
			}catch (IOException ex) {
				ex.printStackTrace();
				}
		}
		
	}
}
