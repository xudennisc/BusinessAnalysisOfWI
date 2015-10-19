package pre;

import org.json.*;
import java.io.*;


public class dataPre {
	
	protected static final int BEGIN = 33001;
	protected static final int RENUM = 3771;
	protected static final int BASE = 20000;
	public void getText( String rdFile, String wrPath) {
		int counter = 0;
		int rangeCount = 0;
		
		BufferedReader br = null;
		try {
 
			String curLine;
			br = new BufferedReader( new FileReader(rdFile) );
			
			String wrFile = wrPath + "0.txt";
			File file = new File(wrFile);
			// if file exists, then delete it
			if ( file.exists() ) {
				file.delete();
			}
			file.createNewFile();
			
			FileWriter fw = new FileWriter( file.getAbsoluteFile() );
			BufferedWriter bw = new BufferedWriter(fw);
			
			//read string
			while ( (curLine = br.readLine() ) != null) {

				//if( ( BEGIN-1 <= counter) && ( counter < BEGIN+RENUM-1) ){
					
					if( (counter-BEGIN+1)%BASE == 0 && (counter-BEGIN+1)/BASE > 0){
						System.out.println( counter/BASE + "time");
						//System.out.println("a" + counter);
						bw.close();
						wrFile = wrPath + (counter/BASE-16) +".txt";
						file = new File(wrFile);
						// if file exists, then delete it
						if ( file.exists() ) {
							file.delete();
						}
						file.createNewFile();
						
						fw = new FileWriter( file.getAbsoluteFile() );
						bw = new BufferedWriter(fw);
						
					}
					
					//convert to json format
					JSONObject jObj = new JSONObject(curLine);
					String tip0 = jObj.getString("text");
					String tip1 = tip0.replaceAll("\\r\\n|\\r|\\n|\\t", " ");
					tip1 = tip1 + " .";
					
					String tip2 = "";
					tip2 = tip1 + " Yaqing. ";	
					bw.write(tip2 + "\n");
					rangeCount++;
				//}
				counter++;
				/*
				if( counter == BEGIN ){
					JSONObject jObj = new JSONObject(curLine);
					String chkStr = jObj.getString("text").replaceAll("\\r\\n|\\r|\\n|\\t", "");
					System.out.println(chkStr);
				}
				*/
			}
			bw.close();
			System.out.println("processed: "+rangeCount);
			System.out.println("total: "+counter);
			
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
