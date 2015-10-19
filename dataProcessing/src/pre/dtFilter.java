package pre;

import java.io.*;
import java.util.*;

import org.json.JSONObject;

public class dtFilter {
	
	public void dtSelect( String path, String rdFile, String newFile ) {
		
		int counter = 0;
		int selectedState = 0;
		String[] arr = { "CA", "GA", "NC", "NV", "NY", "ON", "WI" };
		//"CA", "GA", "NC", "NV", "NY", "ON", "WI"
		List<String> store = new ArrayList<String>();
		Arrays.sort(arr);
		BufferedReader br = null;
		try {
 
			String curLine;
			String rdPath = path + rdFile;
			String wrPath = path + newFile;
			String stPath = path + "storeListNV.txt";
			
			br = new BufferedReader( new FileReader(rdPath) );
			
			File file = new File(wrPath);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			//read string
			while ( (curLine = br.readLine() ) != null) {
				JSONObject jObj = new JSONObject(curLine);
				String state = jObj.getString("state");
				
				if( (Arrays.binarySearch( arr, state )) >=0 ){
					selectedState++;
					bw.write(curLine + "\n");
					store.add( jObj.getString("business_id") );
				}
				
				counter++;
			}
			bw.close();
			
			int selectedBiz = 0;
			String[] storeSelected = store.toArray(new String[store.size()]);
			File file2 = new File(stPath);
			if ( file2.exists() ) {
				file2.delete();
			}
			file2.createNewFile();
			FileWriter fw2 = new FileWriter( file2.getAbsoluteFile() );
			BufferedWriter bw2 = new BufferedWriter(fw2);
			
			for(String st : storeSelected){
				selectedBiz++;
				bw2.write( st + "\n" );
			}
			System.out.println("total: "+counter);
			System.out.println("matched state: "+selectedState);
			System.out.println("matched biz: "+selectedBiz);
			bw2.close();
			
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}

	public void findStr( String file, String attribute, String word ){
		
		int counter = 0;
		BufferedReader br = null;
		try {
			String curLine;
			br = new BufferedReader( new FileReader(file) );
			while ( (curLine = br.readLine() ) != null) {
				JSONObject jObj = new JSONObject(curLine);
				String tip0 = jObj.getString(attribute);
				if( tip0.contains(word) ){
					counter++;
				}
			}
			if( counter == 0 ) System.out.println(word);
			
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		
		
	}
	
	public void orderSelect( String path, String refFile, String targetFile, String liteFile ) {
		
		BufferedReader brr = null;
		BufferedReader brt = null;
		String rLine = null;
		String tLine = null;
		int counter = 0;
		try{
			String refPath = path + refFile;
			String targetPath = path + targetFile;
			String litePath = path + liteFile;
			brr = new BufferedReader( new FileReader(refPath) );
			brt = new BufferedReader( new FileReader(targetPath) );
			
			List<String> store = new ArrayList<String>();
			while( (rLine = brr.readLine()) != null ){
				store.add(rLine);
			}
			brr.close();
			String[] storeList = store.toArray(new String[store.size()]);
			System.out.println( "storeList.length = " + storeList.length );
			
			File file = new File(litePath);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);

			int curIndex = 151;
			int nextIndex = curIndex + 1;
			int idxCnt = 0;
			
			System.out.println("Current index: " + curIndex);
			while( (tLine = brt.readLine()) != null ){
				JSONObject jObj = new JSONObject(tLine);
				if( jObj.getString("business_id").compareTo( storeList[curIndex] ) == 0){
					bw.write( tLine + "\n" );
					idxCnt++;
				}else{
					if( nextIndex == storeList.length ) break;
					else
					if( jObj.getString("business_id").compareTo( storeList[nextIndex] ) == 0 ){
						bw.write( tLine + "\n" );
						curIndex++;
						nextIndex++;
						idxCnt++;
					} 
					
				}
			}
			
			bw.close();
			System.out.println("Total records for this store: " + idxCnt);
			System.out.println("Stop at index:" + curIndex);
			System.out.println(storeList[curIndex]);
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

	public void selectByAttr( String path, String refFile, String rdFile, String newFile ){
		int counter = 0;
		int selectedState = 0;
		
		BufferedReader br = null;
		BufferedReader brr = null;
		try {
 
			String curLine;
			String refPath = path + refFile;
			String rdPath = path + rdFile;
			String wrPath = path + newFile;
			
			br = new BufferedReader( new FileReader(rdPath) );
			brr = new BufferedReader( new FileReader(refPath) );
			
			File file = new File(wrPath);
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			List<String> store = new ArrayList<String>();
			while( (curLine = brr.readLine()) != null ){
				store.add(curLine);
			}
			brr.close();
			String[] storeList = store.toArray(new String[store.size()]);
			System.out.println( "storeList.length = " + storeList.length );
			Arrays.sort(storeList);
			System.out.println( "Start Brute-Force!!!" );
			
			while ( (curLine = br.readLine() ) != null) {

				//convert to json format
				JSONObject jObj = new JSONObject(curLine);
				String bizId = jObj.getString("business_id");
				int a = Arrays.binarySearch( storeList, bizId );
				if( a >= 0)
				{
					selectedState++;
					bw.write(curLine + "\n");
				}
				counter++;
			}
			bw.close();
			
			System.out.println("total: "+counter);
			System.out.println("matched state: "+selectedState);
			
		} catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
			try {
				if (br != null)br.close();
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
	}
}